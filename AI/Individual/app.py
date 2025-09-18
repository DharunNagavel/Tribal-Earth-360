from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load your trained model
try:
    schemes_model = joblib.load("schemes_model.pkl")
    print("✅ Model loaded successfully from 'schemes_model.pkl'")
    model_loaded = True
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model_loaded = False

# Define the features exactly as used during training
features = [
    "State", "Scheduled Tribe", "Other Traditional Forest Dweller", "Age",
    "For Habitation", "For Self-Cultivation", "DisputedLands", "Pattas",
    "Land from Where Displaced Without Compensation", "Extent of Land in Forest Villages"
]

# Scheme mapping
scheme_mapping = {
    0: {"name": "ST/OTFD Scholarship", "desc": "Educational scholarships for students from Scheduled Tribe/Other Traditional Forest Dweller communities."},
    1: {"name": "Rehabilitation & Resettlement Package", "desc": "Compensation and support for persons displaced without prior compensation."},
    2: {"name": "PM-KISAN Scheme", "desc": "Financial assistance for land-holding farmers."},
    3: {"name": "PM Awas Yojana (Housing Scheme)", "desc": "Housing assistance for eligible rural families."},
}

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if not model_loaded:
            return jsonify({'success': False, 'error': 'Model not loaded'})
        
        # Get data from frontend
        data = request.get_json()
        user_data = data.get('userData', {})
        
        # Create DataFrame with the exact features used during training
        user_data_df = pd.DataFrame([{feature: user_data.get(feature, '') for feature in features}])
        
        # Make prediction
        schemes_predictions_raw = schemes_model.predict(user_data_df)
        schemes_predictions = schemes_predictions_raw[0]
        
        # Get recommended schemes
        recommended_schemes = []
        for i, eligible in enumerate(schemes_predictions):
            if eligible:
                scheme_info = scheme_mapping[i]
                recommended_schemes.append({
                    'name': scheme_info['name'],
                    'description': scheme_info['desc']
                })
        
        return jsonify({
            'success': True,
            'recommendedSchemes': recommended_schemes,
            'userName': user_data.get('Name of the Claimant', 'Applicant')
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'message': 'Flask server is running with AI model'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)