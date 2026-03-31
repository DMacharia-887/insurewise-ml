import os
from fastapi import FastAPI
import joblib # or torch, depending on your model

app = FastAPI()

# Load your pre-trained model here
# model = joblib.load("model.pkl") 

@app.get("/")
def read_root():
    return {"status": "ML API is running"}

@app.post("/predict")
def predict(data: dict):
    # Process data and return predictions
    # prediction = model.predict([data['features']])
    return {"prediction": "dummy_result"}
