# ML/file.py

# ... your existing imports ...

def predict_fraud(data):
    # 'data' is a dictionary coming from the frontend
    # Example: data = {'transaction_amount': 500, 'location': 'NY'}
    
    # 1. Process the data (match what your model was trained on)
    input_features = [data['amount'], data['time'], data['location_code']]
    
    # 2. Make prediction (Assuming you loaded your model as 'model')
    # prediction = model.predict([input_features])
    
    # DUMMY LOGIC (Replace this with your actual model prediction)
    if data['amount'] > 10000:
        return "Fraud"
    else:
        return "Legit"