from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# ================== LOAD INDIVIDUAL MODEL ==================
try:
    schemes_model = joblib.load("D:/Tribal-Earth-360/AI/Individual/schemes_model.pkl")
    print("✅ Individual model loaded successfully from 'schemes_model.pkl'")
    individual_model_loaded = True
except Exception as e:
    print(f"❌ Error loading individual model: {e}")
    individual_model_loaded = False

# ================== LOAD COMMUNITY MODEL ==================
try:
    community_model = joblib.load("D:/Tribal-Earth-360/AI/Community/community_model.pkl")
    print("✅ Community model loaded successfully from 'community_model.pkl'")
    community_model_loaded = True
except Exception as e:
    print(f"❌ Error loading community model: {e}")
    community_model_loaded = False

# ================== LOAD COMMUNITY RESOURCES DSS MODEL ==================
try:
    community_resources_model = joblib.load(
        "D:/Tribal-Earth-360/AI/community resource/community_resources_model.pkl"
    )
    print("✅ Community Resources DSS model loaded successfully")
    community_resources_model_loaded = True
except Exception as e:
    print(f"❌ Error loading community resources DSS model: {e}")
    community_resources_model_loaded = False

# ================== FEATURES ==================
# Individual features
individual_features = [
    "State", "Scheduled Tribe", "Other Traditional Forest Dweller", "Age",
    "For Habitation", "For Self-Cultivation", "DisputedLands", "Pattas",
    "Land from Where Displaced Without Compensation", "Extent of Land in Forest Villages"
]

# Community features
community_features = [
    "State", "FDST community", "OTFD community", "Community rights such as nistar",
    "Rights over minor forest produce", "Uses", "Grazing",
    "Traditional resource access for nomadic and pastoralist",
    "Community tenures of habitat and habitation",
    "Right to access biodiversity", "Other traditional rights"
]

# Community Resources DSS features
community_resources_features = [
    "Village", "Gram Panchayat", "Taluka", "District",
    "Compartment No", "Bordering Villages", "List of Evidence in Support"
]

# ================== SCHEME MAPPINGS ==================
# Individual schemes
individual_scheme_mapping = {
    0: {"name": "ST/OTFD Scholarship", "desc": "Educational scholarships for students from Scheduled Tribe/Other Traditional Forest Dweller communities."},
    1: {"name": "Rehabilitation & Resettlement Package", "desc": "Compensation and support for persons displaced without prior compensation."},
    2: {"name": "PM-KISAN Scheme", "desc": "Financial assistance for land-holding farmers."},
    3: {"name": "PM Awas Yojana (Housing Scheme)", "desc": "Housing assistance for eligible rural families."},
}

# Community schemes
community_scheme_mapping = {
    0: {"name": "Community Forest Rights (CFR) Recognition", "desc": "Formal recognition of rights over common forest lands, as per the Forest Rights Act."},
    1: {"name": "Minor Forest Produce (MFP) Support Scheme", "desc": "Financial and technical support for sustainable harvesting and marketing of forest produce."},
    2: {"name": "Customary Grazing Rights Recognition", "desc": "Recognition of traditional grazing rights in forest areas."},
}

# Community Resources DSS schemes
community_resources_scheme_mapping = {
    0: {"name": "Community Infrastructure Grant", "desc": "Grant for developing community infrastructure, based on community resolutions and evidence."},
    1: {"name": "Resource Conservation Fund", "desc": "Funding for projects to conserve and protect specific forest compartments."},
}

# ================== ROUTES ==================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'individual_model_loaded': individual_model_loaded,
        'community_model_loaded': community_model_loaded,
        'community_resources_model_loaded': community_resources_model_loaded,
        'message': 'Flask server is running with AI models'
    })

# ----------------- Individual Prediction -----------------
@app.route('/api/predict', methods=['POST'])
def predict_individual():
    try:
        if not individual_model_loaded:
            return jsonify({'success': False, 'error': 'Individual model not loaded'})
        
        data = request.get_json()
        user_data = data.get('userData', {})
        
        user_data_df = pd.DataFrame([{feature: user_data.get(feature, '') for feature in individual_features}])
        predictions_raw = schemes_model.predict(user_data_df)
        predictions = predictions_raw[0]
        
        recommended_schemes = []
        for i, eligible in enumerate(predictions):
            if eligible:
                scheme_info = individual_scheme_mapping[i]
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

# ----------------- Community Prediction -----------------
@app.route('/api/community/predict', methods=['POST'])
def predict_community():
    try:
        if not community_model_loaded:
            return jsonify({'success': False, 'error': 'Community model not loaded'})
        
        data = request.get_json()
        user_data = data.get('userData', {})
        
        user_data_df = pd.DataFrame([{feature: user_data.get(feature, '') for feature in community_features}])
        predictions_raw = community_model.predict(user_data_df)
        predictions = predictions_raw[0]
        
        recommended_schemes = []
        for i, eligible in enumerate(predictions):
            if eligible:
                scheme_info = community_scheme_mapping[i]
                recommended_schemes.append({
                    'name': scheme_info['name'],
                    'description': scheme_info['desc']
                })
        
        return jsonify({
            'success': True,
            'recommendedSchemes': recommended_schemes,
            'community': f"{user_data.get('FDST community', '')} / {user_data.get('OTFD community', '')}"
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ----------------- Community Resources DSS Prediction -----------------
@app.route('/api/community-resources/predict', methods=['POST'])
def predict_community_resources():
    try:
        if not community_resources_model_loaded:
            return jsonify({'success': False, 'error': 'Community resources model not loaded'})
        
        data = request.get_json()
        user_data = data.get('userData', {})
        
        df_input = pd.DataFrame([user_data])
        predictions_raw = community_resources_model.predict(df_input)
        predictions = predictions_raw[0]

        recommended_schemes = []
        for i, eligible in enumerate(predictions):
            if eligible:
                recommended_schemes.append({
                    'name': community_resources_scheme_mapping[i]['name'],
                    'description': community_resources_scheme_mapping[i]['desc']
                })

        return jsonify({
            'success': True,
            'recommendedSchemes': recommended_schemes,
            'communityName': user_data.get('Village', 'Community')
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ================== RUN APP ==================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
