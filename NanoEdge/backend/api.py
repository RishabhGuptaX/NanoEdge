from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# Enable CORS so frontend can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model safely
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "respiratory_ai_model.pkl")

model = joblib.load(model_path)


@app.get("/")
def home():
    return {"message": "NanoEdge API is running"}


@app.post("/predict")
def predict(data: dict):

    features = np.array([[
        data["age"],
        data["sex"],
        data["diabetes"],
        data["hypertension"],
        data["obesity"],
        data["asthma"],
        data["tobacco"],
        data["temperature"],
        data["spo2"],
        data["heartrate"],
        data["gas"]
    ]])

    # Model prediction
    prob = model.predict_proba(features)[0][1]
    risk = round(prob * 100, 2)

    # Generate additional risk indicators
    if risk < 30:
        hypoxia = "Low"
        asthma = "Low"
        infection = "Low"
    elif risk < 60:
        hypoxia = "Moderate"
        asthma = "Moderate"
        infection = "Moderate"
    else:
        hypoxia = "High"
        asthma = "High"
        infection = "High"

    return {
        "pneumonia_risk": risk,
        "hypoxia_risk": hypoxia,
        "asthma_attack_risk": asthma,
        "respiratory_infection_risk": infection
    }
