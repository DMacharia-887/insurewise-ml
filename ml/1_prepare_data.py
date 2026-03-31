import pandas as pd
import numpy as np

print("Generating InsureWise training dataset...")

# 1. We will generate a synthetic dataset based on the structure of the 
# well-known So, Boucher & Valdez (2021) telematics dataset.
# For this script, we'll create 5,000 realistic rows mimicking Kenyan driving.

np.random.seed(42)
n_samples = 5000

# Generate Features matching Supabase `Telematics` table
avg_speed = np.random.normal(loc=45, scale=15, size=n_samples) # km/h
avg_speed = np.clip(avg_speed, 10, 120)

total_distance = np.random.normal(loc=12000, scale=5000, size=n_samples) # km per year
total_distance = np.clip(total_distance, 1000, 50000)

harsh_breaks = np.random.poisson(lam=15, size=n_samples) # count per year
# Add correlation: faster drivers brake harder
harsh_breaks = harsh_breaks + (avg_speed > 80) * np.random.randint(5, 20, n_samples)

night_driving = np.random.beta(a=2, b=10, size=n_samples) # percentage (0 to 1)
night_driving = np.clip(night_driving, 0, 1)

# Generate Labels mapping to `Risk_report` table
# Risk Score (0-100) -> Higher speed, more breaks, more night driving = Higher Risk
base_risk = 20
risk_from_speed = (avg_speed - 45) * 0.5
risk_from_breaks = harsh_breaks * 1.5
risk_from_night = night_driving * 40
random_noise = np.random.normal(0, 5, n_samples)

risk_score = base_risk + risk_from_speed + risk_from_breaks + risk_from_night + random_noise
risk_score = np.clip(risk_score, 0, 100)

# Fraud Probability (0-1) -> Anomaly detection (extremely high miles + no breaks, etc.)
fraud_prob = np.where((total_distance > 40000) & (harsh_breaks < 5), 
                      np.random.uniform(0.7, 0.99, n_samples), 
                      np.random.beta(1, 10, n_samples))

df = pd.DataFrame({
    'avg_speed': avg_speed,
    'total_distance': total_distance,
    'harsh_breaks': harsh_breaks,
    'night_driving': night_driving,
    'risk_score': risk_score,
    'fraud_prob': fraud_prob
})

df.to_csv('insurewise_training_data.csv', index=False)
print("Data saved to insurewise_training_data.csv")
print(df.head())
