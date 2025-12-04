from flask import Flask, request, jsonify
from flask_cors import CORS
from risk_engine import RiskEngine, generate_user_history # Import your class

app = Flask(__name__)
CORS(app) # Allows your Frontend (React/HTML) to talk to this Backend

# --- CRITICAL STEP: LOAD MODEL ONCE AT STARTUP ---
# We train the model immediately when the server starts.
# We don't want to retrain it every time someone logs in (too slow).
print("Server starting... Initializing ML Engine...")
history_df = generate_user_history() 
global_engine = RiskEngine(history_df) 
print("ML Engine Ready!")

@app.route('/api/login-check', methods=['POST'])
def check_login_risk():
    try:
        # 1. Get data from Frontend
        data = request.json 
        
        # Example data coming from frontend:
        # {
        #   "user_id": "user_123",
        #   "hour_of_day": 14,
        #   "location": "Delhi",
        #   "device": "Chrome",
        #   "failed_attempts": 0
        # }

        # 2. Format it for your ML script
        # Your ML script expects 'failed_attempts_last_5min', let's map it
        login_attempt = {
            'user_id': data.get('user_id'),
            'hour_of_day': int(data.get('hour_of_day')), # Ensure int
            'location': data.get('location'),
            'device': data.get('device'),
            'failed_attempts_last_5min': int(data.get('failed_attempts', 0))
        }

        # 3. Ask the Global Engine for the risk score
        result = global_engine.calculate_risk(login_attempt)

        # 4. Send JSON back to Frontend
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)