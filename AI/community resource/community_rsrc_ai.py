import pandas as pd
import numpy as np
import io
import joblib
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

def train_and_run_community_resources_dss(file_path):
    """
    Reads a CSV file, trains a DSS model for community resource schemes,
    and provides detailed recommendations for each community.
    """
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return

    # --- Configuration and Feature Definition ---
    FEATURES = [
        "Village", "Gram Panchayat", "Taluka", "District",
        "Compartment No", "Bordering Villages", "List of Evidence in Support"
    ]
    
    def create_eligibility_targets(df):
        df['eligible_infrastructure_grant'] = df['List of Evidence in Support'].apply(
            lambda x: 1 if 'resolution' in str(x).lower() or 'petition' in str(x).lower() else 0
        )
        df['eligible_conservation_fund'] = df['Compartment No'].apply(
            lambda x: 1 if str(x) != 'N/A' and str(x) != 'nan' else 0
        )
        return df

    SCHEMES_MAPPING = {
        0: {"name": "Community Infrastructure Grant", "desc": "Grant for developing community infrastructure, based on community resolutions and evidence."},
        1: {"name": "Resource Conservation Fund", "desc": "Funding for projects to conserve and protect specific forest compartments."},
    }

    df = create_eligibility_targets(df.copy())
    TARGETS = list(SCHEMES_MAPPING.values())

    # --- Data Preprocessing ---
    categorical_features = FEATURES
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='passthrough'
    )
    
    # --- Model Training ---
    model = Pipeline(steps=[
        ('preprocessor', preprocessor), 
        ('classifier', MultiOutputClassifier(RandomForestClassifier(random_state=42)))
    ])

    print("Training the AI model...")
    
    # --- FIX APPLIED HERE ---
    model.fit(df[FEATURES], df[['eligible_infrastructure_grant', 'eligible_conservation_fund']])
    # --- END FIX ---
    
    print("Model training complete.")
    
    # --- Optimization: Save the Model and Make Single Prediction ---
    try:
        joblib.dump(model, "community_resources_model.pkl")
        print("✅ Model successfully saved to 'community_resources_model.pkl'.")
    except Exception as e:
        print(f"❌ Error saving the model: {e}")
    
    predictions = model.predict(df[FEATURES])

    # --- Report Generation ---
    print("\n\n" + "=" * 60 + "\n")
    print("AI Decision Support System for Community Resources")
    print("-" * 50)
    
    for index, row in df.iterrows():
        community_name = f"Village: **{row['Village']}**"
        
        print("\n\n" + "=" * 60 + "\n")
        print(f"Simulating application for: {community_name}")
        print("Recommended Government Schemes & Benefits:")
        
        recommended_schemes = [SCHEMES_MAPPING[i]['name'] for i, eligible in enumerate(predictions[index]) if eligible]
        
        if recommended_schemes:
            for i, scheme in enumerate(recommended_schemes, 1):
                print(f"{i}. **{scheme}**")
                correct_desc = next(item['desc'] for item in SCHEMES_MAPPING.values() if item['name'] == scheme)
                print(f"   - {correct_desc}")
        else:
            print("No specific schemes were recommended based on the provided details.")
    print("\n" + "=" * 60)

# Call the function with the path to your new CSV file
train_and_run_community_resources_dss("community_src.csv")