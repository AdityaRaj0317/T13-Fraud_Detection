import os
import json
import time
from flask import Flask, request, jsonify
from redis import Redis
import geoip2.database
from datetime import datetime
import logging
from functools import wraps
from typing import Dict, Any, Optional

# --- Configuration ---
# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# File paths
GEOIP_DATABASE_PATH = 'GeoLite2-City.mmdb'

# Redis connection details
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379

# Thresholds for fraud calculation (Higher weights mean higher impact on score)
RISK_WEIGHTS = {
    'time_diff_hours': 0.3,
    'country_mismatch': 0.4,
    'ip_city_mismatch': 0.3
}
MAX_RISK_SCORE = 100.0

app = Flask(__name__)
redis_client: Optional[Redis] = None
geoip_reader: Optional[geoip2.database.Reader] = None

# --- Utility Functions ---

def retry_on_error(max_retries=3, delay=1):
    """Decorator to retry a function call on connection errors."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    logger.error(f"Attempt {attempt + 1}/{max_retries} failed for {func.__name__}: {e}")
                    if attempt < max_retries - 1:
                        time.sleep(delay)
                    else:
                        raise
        return wrapper
    return decorator

@retry_on_error()
def init_redis() -> Redis:
    """Initialize and test the Redis connection."""
    r = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    r.ping()
    return r

def init_geoip_reader() -> geoip2.database.Reader:
    """Initialize the GeoIP database reader."""
    if not os.path.exists(GEOIP_DATABASE_PATH):
        raise FileNotFoundError(f"GeoIP database file not found at: {GEOIP_DATABASE_PATH}. Did you rename the downloaded GeoLite2-City.mmdb and place it in the root directory?")
    return geoip2.database.Reader(GEOIP_DATABASE_PATH)

def get_location_data(ip_address: str) -> Dict[str, str]:
    """Looks up location (city, country) for a given IP address."""
    if not geoip_reader:
        return {'country': 'Unknown', 'city': 'Unknown'}

    try:
        # Use MaxMind's private IP check to avoid lookup errors
        if ip_address.startswith(('10.', '172.16.', '192.168.', '127.')):
            return {'country': 'Private', 'city': 'Private'}

        response = geoip_reader.city(ip_address)
        return {
            'country': response.country.iso_code or 'Unknown',
            'city': response.city.name or 'Unknown'
        }
    except geoip2.errors.AddressNotFoundError:
        return {'country': 'Not Found', 'city': 'Not Found'}
    except Exception as e:
        logger.error(f"GeoIP lookup failed for {ip_address}: {e}")
        return {'country': 'Error', 'city': 'Error'}

def get_last_transaction(user_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves the last transaction details from Redis."""
    try:
        data = redis_client.get(user_id)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        logger.error(f"Error fetching data for user {user_id} from Redis: {e}")
        return None

def save_current_transaction(user_id: str, ip_address: str, timestamp: str, location: Dict[str, str]):
    """Saves the current transaction details to Redis."""
    try:
        transaction_data = {
            'ip_address': ip_address,
            'timestamp': timestamp,
            'location': location
        }
        redis_client.set(user_id, json.dumps(transaction_data))
    except Exception as e:
        logger.error(f"Error saving data for user {user_id} to Redis: {e}")

# --- Core Risk Logic ---

def calculate_risk_score(last_txn: Dict[str, Any], current_ip: str, current_location: Dict[str, str]) -> Dict[str, Any]:
    """Calculates a fraud risk score based on transaction velocity and location change."""
    score = 0.0
    reasons = []

    # 1. Time Velocity Check (Time Difference)
    last_time = datetime.fromisoformat(last_txn['timestamp'])
    current_time = datetime.fromisoformat(current_location['current_timestamp']) # Use the timestamp saved inside current_location payload
    time_difference = (current_time - last_time).total_seconds() / 3600.0  # Difference in hours

    time_risk = 0.0
    if time_difference < 0.01: # Less than ~36 seconds (indicates high-speed fraud attempt)
        time_risk = 0.9
        reasons.append(f"High-speed velocity detected: {time_difference:.2f} hours since last transaction.")
    elif time_difference < 1: # Less than 1 hour (Medium risk)
        time_risk = 0.5
        reasons.append(f"Fast transaction velocity: {time_difference:.2f} hours since last transaction.")
    
    score += time_risk * RISK_WEIGHTS['time_diff_hours'] * MAX_RISK_SCORE

    # 2. Country Mismatch Check (Highest risk factor)
    country_risk = 0.0
    last_country = last_txn['location']['country']
    current_country = current_location['country']

    if last_country not in ('Unknown', 'Not Found', 'Error', 'Private') and \
       current_country not in ('Unknown', 'Not Found', 'Error', 'Private') and \
       last_country != current_country:
        country_risk = 1.0 # 100% risk if country changes
        reasons.append(f"Country mismatch: Last transaction from {last_country}, current from {current_country}.")
    
    score += country_risk * RISK_WEIGHTS['country_mismatch'] * MAX_RISK_SCORE

    # 3. City Mismatch Check (Medium risk factor)
    city_risk = 0.0
    last_city = last_txn['location']['city']
    current_city = current_location['city']

    # Only check city if countries match (or if one is Unknown/Private and the other is not)
    if country_risk < 1.0 and \
       last_city not in ('Unknown', 'Not Found', 'Error', 'Private') and \
       current_city not in ('Unknown', 'Not Found', 'Error', 'Private') and \
       last_city != current_city:
        city_risk = 0.6 # Medium risk if city changes within the same country
        reasons.append(f"City mismatch: Last transaction from {last_city}, current from {current_city}.")
        
    score += city_risk * RISK_WEIGHTS['ip_city_mismatch'] * MAX_RISK_SCORE

    # Cap score at MAX_RISK_SCORE
    final_score = min(score, MAX_RISK_SCORE)

    # Determine risk level
    if final_score >= 80:
        risk_level = "HIGH"
    elif final_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        'risk_score': round(final_score, 2),
        'risk_level': risk_level,
        'reasons': reasons
    }

# --- Flask Routes ---

@app.route('/analyze_transaction', methods=['POST'])
def analyze_transaction():
    """
    API endpoint to analyze a transaction for potential fraud.
    Requires: user_id (str), ip_address (str)
    """
    data = request.get_json()
    if not data or 'user_id' not in data or 'ip_address' not in data:
        return jsonify({
            'error': 'Missing user_id or ip_address in request payload.'
        }), 400

    user_id = data['user_id']
    ip_address = data['ip_address']
    current_timestamp = datetime.now().isoformat()

    # 1. Get GeoIP Data for the current IP
    current_location = get_location_data(ip_address)
    current_location['current_timestamp'] = current_timestamp # Add timestamp for use in risk logic

    # 2. Retrieve last transaction data
    last_txn = get_last_transaction(user_id)

    # 3. Calculate Risk Score
    response = {
        'user_id': user_id,
        'current_ip': ip_address,
        'current_location': {k: v for k, v in current_location.items() if k != 'current_timestamp'},
        'current_timestamp': current_timestamp,
        'risk_score': 0.0,
        'risk_level': 'LOW',
        'reasons': ['First transaction or no recent history found.']
    }

    if last_txn:
        # Transaction history exists, calculate risk
        risk_data = calculate_risk_score(last_txn, ip_address, current_location)
        
        response['last_transaction'] = last_txn
        response.update(risk_data)
        
        # Override the default low risk reason if a score was calculated
        if response['reasons'] == ['First transaction or no recent history found.']:
             response['reasons'] = []

    # 4. Save the current transaction (even if it's the first one)
    save_current_transaction(user_id, ip_address, current_timestamp, {k: v for k, v in current_location.items() if k != 'current_timestamp'})

    return jsonify(response)

# --- Initialization and Run ---

@app.before_request
def check_globals():
    """Ensure Redis and GeoIP Reader are initialized."""
    global redis_client, geoip_reader
    if redis_client is None:
        # This should theoretically not happen if init is done correctly, but is a safety check
        try:
            redis_client = init_redis()
        except Exception as e:
            logger.error(f"FATAL: Redis connection failed on request: {e}")
            return jsonify({'error': 'Backend service dependency (Redis) is unavailable.'}), 503
    
    if geoip_reader is None:
        try:
            geoip_reader = init_geoip_reader()
        except Exception as e:
             logger.error(f"FATAL: GeoIP initialization failed on request: {e}")
             return jsonify({'error': 'Backend service dependency (GeoIP DB) is unavailable.'}), 503

if __name__ == '__main__':
    try:
        # Initialize Redis connection
        redis_client = init_redis()
        logger.info("STATUS: Successfully connected to Redis.")

        # Initialize GeoIP database reader
        geoip_reader = init_geoip_reader()
        logger.info(f"STATUS: Successfully loaded GeoIP database from {GEOIP_DATABASE_PATH}")

        # Start Flask application
        logger.info("--- Fraud Detection API Starting ---")
        app.run(host='0.0.0.0', port=5000)

    except FileNotFoundError as e:
        logger.error(f"ERROR: {e}")
        logger.error("Please ensure the GeoLite2-City.mmdb file is in the root directory.")
    except Exception as e:
        logger.error(f"FATAL ERROR during startup: {e}")
        logger.error("Please ensure Redis Server is running on 127.0.0.1:6379.")