from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "respiratory_ai_model.pkl")

print("Loading model from:", model_path)

model = joblib.load(model_path)


@app.get("/")
def home():
    return {"message": "NanoEdge API is running"}


@app.post("/predict")
def predict(data: dict):
    try:

        features = np.array([[
            float(data["age"]),
            float(data["sex"]),
            float(data["diabetes"]),
            float(data["hypertension"]),
            float(data["obesity"]),
            float(data["asthma"]),
            float(data["tobacco"]),
            float(data["temperature"]),
            float(data["spo2"]),
            float(data["heartrate"]),
            float(data["gas"])
        ]])

        print("Input features:", features)

        # Try probability prediction first
        try:
            prob = model.predict_proba(features)[0][1]
        except Exception:
            # fallback if model doesn't support predict_proba
            prob = model.predict(features)[0]

        risk = round(float(prob) * 100, 2)

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

    except Exception as e:
        print("Prediction error:", str(e))
        return {
            "pneumonia_risk": 0,
            "hypoxia_risk": "Unknown",
            "asthma_attack_risk": "Unknown",
            "respiratory_infection_risk": "Unknown",
            "error": str(e)
        }
