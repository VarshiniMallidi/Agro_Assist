from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import logging

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load('crop_model (1).pkl')
    scaler = joblib.load('scaler (1).pkl') 

    crop_mapping = {
    1: 'rice',
    2: 'maize',
    3: 'jute',
    4: 'cotton',
    5: 'coconut',
    6: 'papaya',
    7: 'orange',
    8: 'apple',
    9: 'muskmelon',
    10: 'watermelon',
    11: 'grapes',
    12: 'mango',
    13: 'banana',
    14: 'pomegranate',
    15: 'lentil',
    16: 'blackgram',
    17: 'mungbean',
    18: 'mothbeans',
    19: 'pigeonpeas',
    20: 'kidneybeans',
    21: 'chickpea',
    22: 'coffee'
}


    logging.info("Model and scaler loaded successfully.")
except Exception as e:
    logging.error(f"Model/scaler loading failed: {e}")
    model = None
    scaler = None

@app.route("/recommend-crop", methods=["POST"])
def recommend_crop():
    try:
        data = request.json
        logging.debug(f"Received data: {data}")

        features = [
            float(data["nitrogen"]),
            float(data["phosphorus"]),
            float(data["potassium"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]

        scaled_features = scaler.transform([features]) 
        prediction = model.predict(scaled_features)[0]
        crop = crop_mapping.get(int(prediction), "Unknown")

        return jsonify({"recommended_crop": crop})

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({"error": "Failed to get crop recommendation"}), 500
    
    

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
