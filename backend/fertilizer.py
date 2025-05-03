from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import logging
import traceback 

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}}) 

try:
    fert_model = pickle.load(open("fert_model (1).pkl", "rb"))
    fert_scaler = pickle.load(open("fert_scaler (1).pkl", "rb"))
    soil_encoder = pickle.load(open("soil_encoder (1).pkl", "rb"))
    crop_encoder = pickle.load(open("crop_encoder (1).pkl", "rb"))
    logging.info("Fertilizer models and encoders loaded successfully.")
    logging.debug(f"Expected Soil Types: {list(soil_encoder.classes_)}")
    logging.debug(f"Expected Crop Types: {list(crop_encoder.classes_)}")
except FileNotFoundError as fnf_error:
    logging.critical(f"Model/encoder file not found: {fnf_error}. Ensure .pkl files are in the correct directory.")
    raise 
except Exception as e:
    logging.critical(f"Failed to load models/encoders: {e}")
    raise

fert_dict = {
    1: 'Urea',
    2: 'DAP',
    3: '14-35-14',
    4: '28-28',
    5: '17-17-17',
    6: '20-20',
    7: '10-26-26'
}
logging.debug(f"Fertilizer mapping loaded: {fert_dict}")


@app.route("/predict", methods=['POST'])
def predict():
    if not request.is_json:
        logging.warning("Request content type is not JSON")
        return jsonify({'error': 'Request must be JSON'}), 415

    data = request.get_json()
    logging.debug(f"Received data for /predict: {data}")

    required_keys = ['temperature', 'humidity', 'moisture', 'soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorous']
    if not all(key in data for key in required_keys):
        missing_keys = [key for key in required_keys if key not in data]
        error_message = f"Missing required fields: {', '.join(missing_keys)}"
        logging.warning(error_message)
        return jsonify({'error': error_message}), 400 

    try:
        temperature = float(data['temperature'])
        humidity = float(data['humidity'])
        moisture = float(data['moisture'])
        nitrogen = float(data['nitrogen'])
        potassium = float(data['potassium'])
        phosphorous = float(data['phosphorous'])

        soil_type = data['soil_type']
        crop_type = data['crop_type']

        if soil_type not in soil_encoder.classes_:
            error_message = f"Invalid soil type: '{soil_type}'. Valid types are: {', '.join(soil_encoder.classes_)}"
            logging.warning(error_message)
            return jsonify({'error': error_message}), 400
        soil_type_encoded = soil_encoder.transform([soil_type])[0]

        if crop_type not in crop_encoder.classes_:
            error_message = f"Invalid crop type: '{crop_type}'. Valid types are: {', '.join(crop_encoder.classes_)}"
            logging.warning(error_message)
            return jsonify({'error': error_message}), 400
        crop_type_encoded = crop_encoder.transform([crop_type])[0]

        features = np.array([[
            temperature,
            humidity,
            moisture,
            soil_type_encoded,
            crop_type_encoded,
            nitrogen,
            potassium,
            phosphorous
        ]])
        logging.debug(f"Features before scaling: {features}")

        scaled_features = fert_scaler.transform(features)
        logging.debug(f"Scaled features: {scaled_features}")

        prediction_index = fert_model.predict(scaled_features)[0]
        logging.info(f"Raw prediction index: {prediction_index} (Type: {type(prediction_index)})")


        fertilizer = fert_dict.get(prediction_index) 

        if fertilizer is None:
             logging.error(f"Prediction index {prediction_index} not found in fertilizer mapping dictionary.")
             return jsonify({'error': f'Internal error: Invalid prediction index {prediction_index} generated.'}), 500
            

        logging.info(f"Predicted fertilizer: {fertilizer}")

        return jsonify({'fertilizer': fertilizer})

    except ValueError as ve:
        error_message = f"Invalid input value: {ve}. Please check data types and values."
        logging.error(f"{error_message} - Data: {data}")
        return jsonify({'error': error_message}), 400 

    except KeyError as ke:
        error_message = f"Missing expected field in input data: {ke}"
        logging.error(f"{error_message} - Data: {data}")
        return jsonify({'error': error_message}), 400 

    except Exception as e:
        error_message = f"An unexpected error occurred during prediction."
        logging.error(f"{error_message} - Error: {e}\n{traceback.format_exc()}")
        return jsonify({'error': error_message}), 500 

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5002) 
