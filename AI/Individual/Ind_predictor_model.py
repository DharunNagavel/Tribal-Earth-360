import pandas as pd
import numpy as np
import io
import joblib  # Added to save the model
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

def train_and_run_dss(file_path):
    """
    Reads a CSV file, trains a DSS model for schemes,
    and provides detailed recommendations for each row.
    """
    try:
        # This line uses the 'file_path' parameter that is passed when the function is called
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        print("Please ensure your uploaded CSV file is named exactly 'fra_holders.csv'.")
        return

    # --- Data Cleaning and Preprocessing ---
    # Handle any missing or blank values in the dataframe
    df.replace('', np.nan, inplace=True)
    
    # Create scheme eligibility columns based on your provided data
    df['eligible_scholarship'] = df['Scheduled Tribe'].apply(lambda x: 1 if x == 'Yes' else 0)
    df['eligible_rehab'] = df['Land from Where Displaced Without Compensation'].apply(lambda x: 1 if x != 'N/A' else 0)
    df['eligible_pmkisan'] = df['For Self-Cultivation'].apply(lambda x: 1 if x == 'Yes' else 0)
    df['eligible_awas'] = df['For Habitation'].apply(lambda x: 1 if x == 'Yes' else 0)
    
    # Define features and targets
    features = [
        "State", "Scheduled Tribe", "Other Traditional Forest Dweller", "Age",
        "For Habitation", "For Self-Cultivation", "DisputedLands", "Pattas",
        "Land from Where Displaced Without Compensation", "Extent of Land in Forest Villages"
    ]
    X = df[features]
    y_schemes = df[['eligible_scholarship', 'eligible_rehab', 'eligible_pmkisan', 'eligible_awas']]

    # Preprocessing pipeline
    categorical_features = [
        "State", "Scheduled Tribe", "Other Traditional Forest Dweller",
        "For Habitation", "For Self-Cultivation", "DisputedLands", "Pattas",
        "Land from Where Displaced Without Compensation"
    ]
    
    categorical_transformer = Pipeline(steps=[
        # Imputer handles any missing values in categorical data to prevent errors
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    numerical_features = ["Age", "Extent of Land in Forest Villages"]
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='mean'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features),
            ('num', numerical_transformer, numerical_features)
        ]
    )

    # Train the schemes model only, as per your request
    schemes_model = Pipeline(steps=[
        ('preprocessor', preprocessor), 
        ('classifier', MultiOutputClassifier(RandomForestClassifier(random_state=42)))
    ])

    print("Training the AI model...")
    schemes_model.fit(X, y_schemes)
    print("Model training complete.")

    # --- ADDITION ---
    # Save the trained model to a .pkl file
    try:
        joblib.dump(schemes_model, "schemes_model.pkl")
        print("✅ Model successfully saved to 'schemes_model.pkl'.")
    except Exception as e:
        print(f"❌ Error saving the model: {e}")
    # --- END ADDITION ---

    # Iterate through the DataFrame and generate the detailed output for each applicant
    for index, row in df.iterrows():
        user_data = row[features].to_dict()
        user_data_df = pd.DataFrame([user_data])
        
        schemes_predictions_raw = schemes_model.predict(user_data_df)
        schemes_predictions = schemes_predictions_raw[0]

        print("\n\n" + "=" * 60 + "\n")
        print(f"Simulating application for: **{row['Name of the Claimant']}**")
        print("AI Decision Support System for Government Schemes")
        print("-" * 50)
        
        # Scheme Recommendations Section
        print("Recommended Government Schemes & Benefits:")
        scheme_mapping = {
            0: {"name": "ST/OTFD Scholarship", "desc": "Educational scholarships for students from Scheduled Tribe/Other Traditional Forest Dweller communities."},
            1: {"name": "Rehabilitation & Resettlement Package", "desc": "Compensation and support for persons displaced without prior compensation."},
            2: {"name": "PM-KISAN Scheme", "desc": "Financial assistance for land-holding farmers."},
            3: {"name": "PM Awas Yojana (Housing Scheme)", "desc": "Housing assistance for eligible rural families."},
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

# Call the function with the path to your CSV file
# This is the line you will edit if your file is in a different location
train_and_run_dss("fra_holders.csv")