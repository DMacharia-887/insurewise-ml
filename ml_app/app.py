import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client

# Initialize FastAPI
app = FastAPI(title="Insurewise ML Engine")

# Allow CORS so your React frontend can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Connect to Supabase
# Make sure to add these to your Railway Environment Variables!
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://uwupuhvweanoaszvelsl.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_EL1AjL5cKSODzUMM8SRPpA_r_P__zze")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Define the exact payload React is sending
class TelematicsInput(BaseModel):
    total_distance_km: float
    night_driving_ratio: float
    overspeed_events: int
    hard_braking_events: int
    hard_acceleration_events: int

@app.post("/predict")
async def predict_risk(data: TelematicsInput):
    try:
        # 3. FETCH LIVE WEIGHTS FROM SUPABASE
        response = supabase.table("Model_Weights").select("*").execute()
        
        # Convert the database rows into a simple dictionary: {'Excessive Speeding': 0.35, ...}
        weights = {row["feature_name"]: float(row["weight"]) for row in response.data}
        
        # Fallbacks just in case the database is empty
        w_speed = weights.get("Excessive Speeding", 0.35)
        w_brake = weights.get("Hard Braking Patterns", 0.25)
        w_night = weights.get("Night Driving Ratio", 0.15)
        w_accel = weights.get("Hard Acceleration", 0.10)
        w_fraud = weights.get("Fraud Probability", 0.15)

        # 4. DYNAMIC RISK ALGORITHM
        # Start with a perfect score of 100
        base_score = 100.0

        # Calculate penalties using the live weights from the Admin Panel
        # (Multiplier constants scale the events so they meaningfully affect a 1-100 score)
        speed_penalty = (data.overspeed_events * w_speed * 4)
        brake_penalty = (data.hard_braking_events * w_brake * 5)
        accel_penalty = (data.hard_acceleration_events * w_accel * 4)
        
        # Night ratio is a percentage (0.0 to 1.0), so we multiply by 20 to give it a max 20 point penalty
        night_penalty = (data.night_driving_ratio * w_night * 20)

        total_penalty = speed_penalty + brake_penalty + accel_penalty + night_penalty

        # Final Score (floored at 10 to ensure it never goes negative)
        final_score = max(10.0, round(base_score - total_penalty))

        # 5. DYNAMIC FRAUD PROBABILITY
        # If they drive crazy at night, fraud risk increases based on the fraud weight
        fraud_risk = 0.05 + (data.night_driving_ratio * w_fraud) + (data.overspeed_events * 0.01)
        fraud_risk = min(0.95, round(fraud_risk, 3)) # Cap at 95%

        # Determine Risk Category for the UI
        category = "Low"
        if final_score < 40:
            category = "Critical"
        elif final_score < 60:
            category = "High"
        elif final_score < 80:
            category = "Moderate"

        return {
            "risk_score": int(final_score),
            "risk_category": category,
            "fraud_prob": fraud_risk,
            "status": "success",
            "weights_used": weights # Pass back what weights were used for logging/debugging!
        }

    except Exception as e:
        print(f"ML Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Simple health check endpoint
@app.get("/")
def read_root():
    return {"status": "ML Engine is running and connected to Supabase!"}
