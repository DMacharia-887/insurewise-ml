import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

print("Loading data...")
df = pd.read_csv('insurewise_training_data.csv')

# Features (from Telematics table) and Target (from Risk_report table)
X = df[['avg_speed', 'total_distance', 'harsh_breaks', 'night_driving']]
y_risk = df['risk_score']

# Split data: 80% for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(X, y_risk, test_size=0.2, random_state=42)

print("Training Random Forest Regressor for Risk Score...")
# Random Forest is ideal for tabular telematics data
rf_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate the model
predictions = rf_model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print("\n--- Model Performance ---")
print(f"Mean Absolute Error (MAE): {mae:.2f} (Model predicts risk score within +/- {mae:.2f} points)")
print(f"R-squared Score (R2): {r2:.2f} (Model explains {r2*100:.1f}% of the variance in risk)")

# See which features matter most
importances = rf_model.feature_importances_
print("\n--- Feature Importance ---")
for feature, imp in zip(X.columns, importances):
    print(f"{feature}: {imp*100:.1f}%")

# Save the trained model
joblib.dump(rf_model, 'insurewise_risk_model.joblib')
print("\nModel saved successfully as 'insurewise_risk_model.joblib'")
