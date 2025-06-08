from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
from .models import CrimeData
from crime_prediction.model import predict_crime
from joblib import load
from django.http import JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
import os
from voice_alert.speech_detection import detect_emergency  # Ensure correct import path
from django.conf import settings

# Load trained machine learning model and features from the correct path
model = load("crime_prediction/crime_prediction/crime_prediction_model.pkl")
model_features = load("crime_prediction/crime_prediction/model_features.pkl")
model_rate = load("crime_prediction/crime_prediction/crime_rate_model.pkl")
max_crime_rate = load("crime_prediction/crime_prediction/max_crime_rate.pkl")  # Load max crime rate

"""@csrf_exempt
def get_crime_data(request):
    
    crimes = CrimeData.objects.all().values()
    return JsonResponse(list(crimes), safe=False)"""

@csrf_exempt
def record_voice_api(request):
    """API to trigger emergency voice recording and return the file path."""
    if request.method == "POST":
        audio_file = detect_emergency()  # Make sure this function is defined
        if audio_file:
            return JsonResponse({"status": "success", "audio_file": audio_file})
        return JsonResponse({"status": "failed", "message": "No emergency detected."})

    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=400)

def get_audio_file(request, filename):
    """Serves the recorded audio file."""
    file_path = f"recordings/{filename}"

    if os.path.exists(file_path):
        return FileResponse(open(file_path, "rb"), content_type="audio/wav")

    return JsonResponse({"status": "error", "message": "File not found."})

@csrf_exempt
def predict_crime_api(request):
    """Predict crime type and estimate crime rate"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Extract user input
            latitude = float(data["latitude"])
            longitude = float(data["longitude"])
            Neighbourhood = data["Neighbourhood"]
            occurrencehour = int(data["occurrencehour"])
            occurrencedayofweek = data["occurrencedayofweek"]
            premisetype = data["premisetype"]

            # Step 1: Predict Crime Type
            predicted_crime = predict_crime(
                latitude, longitude, Neighbourhood, occurrencehour, occurrencedayofweek, premisetype
            )



            # Step 2: Estimate Crime Rate using ML Model
            user_input = pd.DataFrame([{
                "latitude": latitude,
                "longitude": longitude,
                "Neighbourhood": Neighbourhood,
                "occurrencehour": occurrencehour,
                "occurrencedayofweek": occurrencedayofweek,
                "premisetype": premisetype
            }])

            # One-hot encode the user input to match training data features
            user_encoded = pd.get_dummies(user_input).reindex(columns=model_features, fill_value=0)

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

            return JsonResponse({
                "crime_type": predicted_crime["crime_type"],
                "crime_rate_percentage": crime_rate_percentage,
                "risk_level": risk_level,
                "latitude": latitude,
                "longitude": longitude
            })
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

def all_crime_data(request):
    """API to return all crime data with calculated risk levels."""
    try:
        # Fetch all crime entries from the database
        crime_entries = list(CrimeData.objects.all()[:1000].values())  

        if not crime_entries:
            return JsonResponse({"error": "No crime data found in the database"}, status=404)

        # Convert database data into a DataFrame
        df = pd.DataFrame(crime_entries)

        if df.empty:
            return JsonResponse([], safe=False)  # Return empty list if no data

        # One-hot encode categorical features to match model training data
        df_encoded = pd.get_dummies(df).reindex(columns=model_features, fill_value=0)

        # Predict crime rates for all locations at once
        estimated_crime_rates = model_rate.predict(df_encoded)

        # Calculate crime rate percentages and risk levels
        crime_rate_percentages = (estimated_crime_rates / max_crime_rate) * 100

        # Assign risk levels based on thresholds
        df["crime_rate_percentage"] = crime_rate_percentages.round(2)
        df["risk_level"] = df["crime_rate_percentage"].apply(
            lambda x: "High" if x > 70 else "Medium" if x > 40 else "Low"
        )

        # Convert DataFrame back to a list of dictionaries for JSON response
        response_data = df.to_dict(orient="records")

        return JsonResponse(response_data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
def get_audio_file(request, filename):
    audio_url = f"{settings.MEDIA_URL}recordings/{filename}"
    return JsonResponse({"audio_file": audio_url})