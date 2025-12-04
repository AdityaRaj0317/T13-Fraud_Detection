import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder
import datetime
import random

# ==========================================
# 1. SETUP & SYNTHETIC DATA GENERATION
# ==========================================
# In a real app, this comes from your SQL/NoSQL DB
def generate_user_history(user_id="user_123", n=100):
    """
    Generates 'normal' behavior for a user: 
    - Mostly logs in from 'Delhi'
    - Mostly uses 'Chrome'
    - Mostly logs in between 9 AM and 6 PM
    """
    data = []
    cities = ['Delhi'] * 90 + ['Mumbai'] * 10  # 90% Delhi
    devices = ['Chrome'] * 85 + ['Firefox'] * 15 # 85% Chrome
    
    for _ in range(n):
        # Normal hours 09:00 to 18:00
        hour = int(np.random.normal(14, 2)) 
        hour = max(0, min(23, hour))
        
        city = random.choice(cities)
        device = random.choice(devices)
        
        # 0 failed attempts usually
        failed_attempts = 0 if random.random() > 0.05 else random.randint(1, 2)
        
        data.append({
            'user_id': user_id,
            'hour_of_day': hour,
            'location': city,
            'device': device,
            'failed_attempts_last_5min': failed_attempts
        })
    
    return pd.DataFrame(data)

# ==========================================
# 2. THE ML ENGINE CLASS
# ==========================================
class RiskEngine:
    def __init__(self, historical_data):
        self.df = historical_data.copy()
        self.encoders = {}
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self.train_model()
        
    def preprocess(self, df, training=False):
        """Convert categorical text to numbers for ML"""
        df_processed = df.copy()
        
        # Features we care about
        cat_features = ['location', 'device']
        
        for col in cat_features:
            if training:
                le = LabelEncoder()
                df_processed[col] = le.fit_transform(df_processed[col])
                self.encoders[col] = le
            else:
                # Handle unseen labels (e.g., new city) safely
                le = self.encoders[col]
                df_processed[col] = df_processed[col].map(
                    lambda s: le.transform([s])[0] if s in le.classes_ else -1
                )
        
        # Select numeric features for the model
        features = ['hour_of_day', 'location', 'device', 'failed_attempts_last_5min']
        return df_processed[features]

    def train_model(self):
        print("Training Risk Model on Historical Data...")
        X = self.preprocess(self.df, training=True)
        self.model.fit(X)
        print("Model Trained successfully.\n")

    def calculate_risk(self, login_request):
        """
        Input: Dictionary of current login attempt
        Output: Risk Score (0-100) & Action
        """
        # 1. Convert input to DataFrame
        current_data = pd.DataFrame([login_request])
        
        # 2. Preprocess for ML
        X_new = self.preprocess(current_data, training=False)
        
        # 3. Get ML Anomaly Score
        # -1 is anomaly, 1 is normal
        pred = self.model.predict(X_new)[0]
        # decision_function gives a raw float score. Lower = more anomalous.
        raw_score = self.model.decision_function(X_new)[0]
        
        # 4. HYBRID SCORING LOGIC
        # Start with base score based on ML confidence
        risk_score = 0
        
        # --- ML Factor ---
        if pred == -1:
            risk_score += 40 # Significant jump if ML marks it as outlier
            
        # --- Rule-Based Factors (The "Context") ---
        
        # Rule 1: High Velocity (Brute Force Detection)
        if login_request['failed_attempts_last_5min'] > 5:
            risk_score += 80  # CHANGED FROM 50 TO 80 (Guarantees a BLOCK)
        elif login_request['failed_attempts_last_5min'] > 2:
            risk_score += 20
            
        # Rule 2: Impossible Travel / New Location (Simulated by encoding check)
        # If the encoder returned -1, it means we've never seen this city before
        if X_new['location'].values[0] == -1:
            risk_score += 30 # New location penalty
            
        # Rule 3: Unusual Time (Simple heuristic)
        if login_request['hour_of_day'] < 5 or login_request['hour_of_day'] > 23:
            risk_score += 15

        # Cap score at 100
        risk_score = min(100, risk_score)
        
        return self.determine_action(risk_score)

    def determine_action(self, score):
        action = ""
        if score <= 30:
            action = "ALLOW (Low Risk)"
        elif 31 <= score <= 70:
            action = "MFA_CHALLENGE (Medium Risk)"
        else:
            action = "BLOCK (High Risk)"
            
        return {
            "risk_score": score,
            "action": action,
            "details": "ML Anomaly" if score > 30 else "Normal Behavior"
        }

# ==========================================
# 3. DEMO EXECUTION (Hackathon Deliverables)
# ==========================================

# A. Setup History
history_df = generate_user_history()
engine = RiskEngine(history_df)

print("--- DEMO STARTING ---\n")

# SCENARIO 1: Normal Login
# User logging in from Delhi (Usual place) at 2 PM (Usual time)
login_1 = {
    'user_id': 'user_123', 
    'hour_of_day': 14, 
    'location': 'Delhi', 
    'device': 'Chrome', 
    'failed_attempts_last_5min': 0
}
result_1 = engine.calculate_risk(login_1)
print(f"Scenario 1 (Normal): {login_1}")
print(f"Result: {result_1}\n")

# SCENARIO 2: Suspicious (Medium Risk)
# User logging in from Russia (New Location) at 3 AM (Unusual Time)
login_2 = {
    'user_id': 'user_123', 
    'hour_of_day': 3, 
    'location': 'Moscow', # Never seen before
    'device': 'Tor Browser', # Never seen before
    'failed_attempts_last_5min': 0
}
result_2 = engine.calculate_risk(login_2)
print(f"Scenario 2 (Suspicious): {login_2}")
print(f"Result: {result_2}\n")

# SCENARIO 3: Brute Force Attack (High Risk)
# User from Usual place but with 10 failed attempts just now
login_3 = {
    'user_id': 'user_123', 
    'hour_of_day': 14, 
    'location': 'Delhi', 
    'device': 'Chrome', 
    'failed_attempts_last_5min': 15 # VELOCITY ATTACK
}
result_3 = engine.calculate_risk(login_3)
print(f"Scenario 3 (Brute Force): {login_3}")
print(f"Result: {result_3}\n")


def print_dashboard_summary(results):
    print("\n" + "="*40)
    print("      ADMIN THREAT MONITORING      ")
    print("="*40)
    print(f"{'TIMESTAMP':<10} | {'USER':<10} | {'RISK':<5} | {'ACTION':<15}")
    print("-" * 45)
    
    # Fake timestamps for the demo
    times = ["10:05:01", "10:05:45", "10:06:12"]
    
    for i, res in enumerate(results):
        r_score = res['result']['risk_score']
        action = res['result']['action'].split(" ")[0] # Just grab the first word
        
        # Color coding (ANSI escape codes)
        if r_score > 70:
            color = "\033[91m" # Red
        elif r_score > 30:
            color = "\033[93m" # Yellow
        else:
            color = "\033[92m" # Green
        reset = "\033[0m"
        
        print(f"{times[i]:<10} | {'user_123':<10} | {color}{r_score:<5}{reset} | {color}{action:<15}{reset}")
    print("="*40)

# Collect your results into a list
all_results = [
    {'scenario': 1, 'result': result_1},
    {'scenario': 2, 'result': result_2},
    {'scenario': 3, 'result': result_3}
]

print_dashboard_summary(all_results)