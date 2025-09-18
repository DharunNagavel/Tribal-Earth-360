import pandas as pd
import numpy as np
import io
import joblib  # This library is needed to save the model
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

def train_and_run_community_dss(file_path):
    """
    Reads a CSV file, trains a DSS model for community schemes,
    and provides detailed recommendations for each row.
    """
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        print("Please ensure your CSV file is in the same directory as the script.")
        return

    # --- Data Cleaning and Preprocessing ---
    df.replace('', np.nan, inplace=True)

    # --- DEBUGGING: VERIFYING YOUR DATASET VALUES ---
    print("--- DEBUGGING: VERIFYING YOUR DATASET VALUES ---")
    print(df[['FDST community', 'Community tenures of habitat and habitation', 'Rights over minor forest produce', 'Grazing']])
    print("--------------------------------------------------")
    # --- END OF DEBUGGING ADDITION ---
    
    # Create scheme eligibility columns based on your provided data
    df['eligible_cfr'] = df['Community tenures of habitat and habitation'].apply(lambda x: 1 if x == 'Yes' else 0)
    df['eligible_mfp'] = df['Rights over minor forest produce'].apply(lambda x: 1 if x != 'N/A' else 0)
    df['eligible_grazing_rights'] = df['Grazing'].apply(lambda x: 1 if x == 'Yes' else 0)
    
    # Define features and targets for the community model
    features = [
        "State", "FDST community", "OTFD community", "Community rights such as nistar",
        "Rights over minor forest produce", "Uses", "Grazing",
        "Traditional resource access for nomadic and pastoralist",
        "Community tenures of habitat and habitation",
        "Right to access biodiversity", "Other traditional rights"
    ]
    X = df[features]
    y_schemes = df[['eligible_cfr', 'eligible_mfp', 'eligible_grazing_rights']]

    # Preprocessing pipeline
    categorical_features = [
        "State", "FDST community", "OTFD community", "Community rights such as nistar",
        "Rights over minor forest produce", "Uses", "Grazing",
        "Traditional resource access for nomadic and pastoralist",
        "Community tenures of habitat and habitation",
        "Right to access biodiversity", "Other traditional rights"
    ]
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    numerical_features = []
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough'
    )
    
    schemes_model = Pipeline(steps=[
        ('preprocessor', preprocessor), 
        ('classifier', MultiOutputClassifier(RandomForestClassifier(random_state=42)))
    ])

    print("Training the AI model...")
    schemes_model.fit(X, y_schemes)
    print("Model training complete.")

    # --- ADDITION TO DOWNLOAD .PKL FILE ---
    try:
        joblib.dump(schemes_model, "community_model.pkl")
        print("✅ Model successfully saved to 'community_model.pkl'.")
    except Exception as e:
        print(f"❌ Error saving the model: {e}")
    # --- END OF ADDITION ---

    for index, row in df.iterrows():
        user_data = row[features].to_dict()
        user_data_df = pd.DataFrame([user_data])
        
        schemes_predictions_raw = schemes_model.predict(user_data_df)
        schemes_predictions = schemes_predictions_raw[0]

        print("\n\n" + "=" * 60 + "\n")
        print(f"Simulating application for community: **{row['FDST community']} / {row['OTFD community']}**")
        print("AI Decision Support System for Community-Based Schemes")
        print("-" * 50)
        
        print("Recommended Government Schemes & Benefits:")
        scheme_mapping = {
            0: {"name": "Community Forest Rights (CFR) Recognition", "desc": "Formal recognition of rights over common forest lands, as per the Forest Rights Act."},
            1: {"name": "Minor Forest Produce (MFP) Support Scheme", "desc": "Financial and technical support for sustainable harvesting and marketing of forest produce."},
            2: {"name": "Customary Grazing Rights Recognition", "desc": "Recognition of traditional grazing rights in forest areas."},
        }
        
        recommended_schemes = [scheme_mapping[i]['name'] for i, eligible in enumerate(schemes_predictions) if eligible]
        
        if recommended_schemes:
            for i, scheme in enumerate(recommended_schemes, 1):
                print(f"{i}. **{scheme}**")
                correct_desc = next(item['desc'] for item in scheme_mapping.values() if item['name'] == scheme)
                print(f"   - {correct_desc}")
        else:
            print("No specific schemes were recommended based on the provided details.")
    print("\n" + "=" * 60)

train_and_run_community_dss("community_data.csv")