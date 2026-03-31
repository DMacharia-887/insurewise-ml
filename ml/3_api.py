from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

# Initialize FastAPI app
app = FastAPI(title="InsureWise ML Engine")

# Allow your React frontend (running on localhost:5173) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained ML model
try:
    model = joblib.load('insurewise_risk_model.joblib')
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# Define the expected input data structure (matches your React form/Supabase table)
class TelematicsData(BaseModel):
    avg_speed: float
    total_distance: float
    harsh_breaks: int
    night_driving: float

@app.get("/")
def health_check():
    return {"status": "InsureWise ML Engine is running"}

@app.post("/predict-risk")
def predict_risk(data: TelematicsData):
    if model is None:
        raise HTTPException(status_code=500, detail="ML Model is not loaded")
    
    try:
        # Convert incoming JSON data into a pandas DataFrame (which the model expects)
        input_df = pd.DataFrame([{
            "avg_speed": data.avg_speed,
            "total_distance": data.total_distance,
            "harsh_breaks": data.harsh_breaks,
            "night_driving": data.night_driving
        }])
        
        # Make the prediction
        prediction = model.predict(input_df)[0]
        
        # Format the output
        risk_score = round(float(prediction), 2)
        
        # Simple rule-based premium & fraud calc (to be replaced by ML models in Phase 2)
        base_premium = 3000
        recommended_premium = round(base_premium + (risk_score * 50), 2)
        
        fraud_prob = 0.85 if (data.total_distance > 30000 and data.harsh_breaks == 0) else 0.05
        
        return {
            "risk_score": risk_score,
            "recommended_premium": recommended_premium,
            "fraud_prob": fraud_prob,
            "risk_category": "High Risk" if risk_score > 65 else "Moderate Risk" if risk_score > 40 else "Safe Driver"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run the API on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
