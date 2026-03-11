from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("backend/respiratory_ai_model.pkl")

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
        "pneumonia_risk": round(prob*100,2)
    }

app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")