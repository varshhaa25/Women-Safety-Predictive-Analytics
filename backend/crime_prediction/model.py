import pandas as pd
import joblib

# Load trained models and features
model_type = joblib.load("crime_prediction/crime_prediction/crime_prediction_model.pkl")
model_rate = joblib.load("crime_prediction/crime_prediction/crime_rate_model.pkl")
model_features = joblib.load("crime_prediction/crime_prediction/model_features.pkl")
max_crime_rate = joblib.load("crime_prediction/crime_prediction/max_crime_rate.pkl")  # Load max crime rate

def predict_crime(latitude, longitude, Neighbourhood, occurrencehour, occurrencedayofweek, premisetype):
    """
    Predict crime type, estimate crime rate percentage, and classify risk level.
    """

    # Create a DataFrame for input
    user_input = pd.DataFrame([{
        "latitude": latitude,
        "longitude": longitude,
        "Neighbourhood": Neighbourhood,
        "occurrencehour": occurrencehour,
        "occurrencedayofweek": occurrencedayofweek,
        "premisetype": premisetype
    }])

    # One-hot encode user input to match training features
    user_encoded = pd.get_dummies(user_input).reindex(columns=model_features, fill_value=0)

    # Predict crime type
    predicted_crime_type = model_type.predict(user_encoded)[0]

    # Predict crime rate
    estimated_crime_rate = model_rate.predict(user_encoded)[0]

    # Convert crime rate to percentage
    crime_rate_percentage = round((estimated_crime_rate / max_crime_rate) * 100, 2)

    # Determine risk level
    if crime_rate_percentage > 70:
        risk_level = "High"
    elif crime_rate_percentage > 40:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "crime_type": predicted_crime_type,
        "crime_rate_percentage": float(crime_rate_percentage),
        "risk_level": risk_level
    }
