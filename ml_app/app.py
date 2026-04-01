import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

# 1. Initialize the FastAPI app
app = FastAPI(
    title="InsureWise Traccar ML API",
    description="Predicts driver risk score based on Traccar telematics data",
    version="1.0"
)

# 2. Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# 3. Load the new Traccar ML Model
MODEL_PATH = "traccar_risk_model.joblib"

try:
    model = joblib.load(MODEL_PATH)
    print(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# 4. Define the exact features the model was trained on
class TraccarData(BaseModel):
    total_distance_km: float
    night_driving_ratio: float
    overspeed_events: int
    hard_braking_events: int
    hard_acceleration_events: int

# 5. Health Check Endpoint
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "InsureWise Traccar API",
        "model_loaded": model is not None
    }

# 6. Prediction Endpoint
@app.post("/predict")
def predict_risk(data: TraccarData):
    if model is None:
        raise HTTPException(status_code=500, detail="ML model is not loaded.")
    
    try:
        # Order MUST match the training dataframe:
        # total_distance_km, night_driving_ratio, overspeed_events, hard_braking_events, hard_acceleration_events
        features = np.array([[
            data.total_distance_km,
            data.night_driving_ratio,
            data.overspeed_events,
            data.hard_braking_events,
            data.hard_acceleration_events
        ]])

        # Generate the prediction
        prediction = model.predict(features)
        risk_score = float(prediction[0])
        
        # Ensure score stays within the 0-100 bounds
        risk_score = max(0.0, min(100.0, risk_score))
        
        return {
            "success": True,
            "risk_score": round(risk_score, 2),
            "risk_level": "High" if risk_score > 75 else "Medium" if risk_score > 45 else "Low"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
