# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# 1. Add 'ML' folder to the system path so we can import your file
sys.path.append(os.path.join(os.path.dirname(__file__), 'ML'))
from file import predict_fraud  # Import the function from Step 1

app = Flask(__name__)
CORS(app)  # This allows your Frontend to talk to this Backend

@app.route('/')
def home():
    return "Fraud Detection API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1. Get data from frontend
        data = request.json 
        
        # 2. Pass data to your ML logic
        result = predict_fraud(data)
        
        # 3. Send result back to frontend
        return jsonify({'prediction': result, 'status': 'success'})
        
    except Exception as e:
        return jsonify({'error': str(e), 'status': 'fail'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)