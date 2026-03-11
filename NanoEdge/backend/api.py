from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import joblib
import numpy as np
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get current directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load ML model safely
model_path = os.path.join(BASE_DIR, "respiratory_ai_model.pkl")
model = joblib.load(model_path)

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

    prob = model.predict_proba(features)[0][1]

    return {
        "pneumonia_risk": round(prob * 100, 2)
    }

# Serve frontend (if built)
frontend_path = os.path.join(BASE_DIR, "../frontend/dist")

if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
