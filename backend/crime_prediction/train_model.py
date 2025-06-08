import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("C:\\Users\\srini\\OneDrive\\Desktop\\varsha ws\\women_safety_dashboard\\backend\\crime_prediction\\MCI_2014_to_2019.csv")

# Select important columns
selected_features = [
    "latitude", "longitude", "Neighbourhood", "occurrencehour", "occurrencedayofweek", "premisetype"
]
df = df[selected_features + ["MCI"]]  # Include target variable (MCI - Major Crime Indicator)

# Calculate crime rate (approximate using frequency per Neighbourhood)
df["crime_rate"] = df.groupby("Neighbourhood")["MCI"].transform("count")

# Drop missing values
df.dropna(inplace=True)

# Encode categorical features
categorical_features = ["Neighbourhood", "occurrencedayofweek", "premisetype"]
df_encoded = pd.get_dummies(df, columns=categorical_features)

# Separate features & targets
X = df_encoded.drop(columns=["MCI", "crime_rate"])  # Features
y_crime_type = df["MCI"]  # Target 1: Crime Type
y_crime_rate = df["crime_rate"]  # Target 2: Crime Rate

# Train-test split
X_train, X_test, y_type_train, y_type_test = train_test_split(X, y_crime_type, test_size=0.2, random_state=42)
_, _, y_rate_train, y_rate_test = train_test_split(X, y_crime_rate, test_size=0.2, random_state=42)

# Train Crime Type Model (Classification)
model_type = RandomForestClassifier(n_estimators=100, random_state=42)
model_type.fit(X_train, y_type_train)

# Train Crime Rate Model (Regression)
model_rate = RandomForestRegressor(n_estimators=100, random_state=42)
model_rate.fit(X_train, y_rate_train)

# Find the maximum crime rate in the dataset
max_crime_rate = df["crime_rate"].max()

# ✅ Ensure the directory exists before saving models
os.makedirs("crime_prediction", exist_ok=True)

# Save trained models & feature names
joblib.dump(model_type, "crime_prediction/crime_prediction_model.pkl")
joblib.dump(model_rate, "crime_prediction/crime_rate_model.pkl")
joblib.dump(list(X.columns), "crime_prediction/model_features.pkl")
# Save max crime rate
joblib.dump(max_crime_rate, "crime_prediction/max_crime_rate.pkl")

print("✅ Models trained & saved successfully!")

