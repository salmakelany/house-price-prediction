from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import json
import pandas as pd


# Load model
model = joblib.load("house_price.pkl")

# Load locations
with open("locations.json", "r") as f:
    locations = json.load(f)


app = FastAPI(
    title="House Price Prediction API",
    description="API for predicting house prices",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request schema
class HouseData(BaseModel):
    carpet_area_sqft: float
    floor_num: float
    bathroom: float
    balcony_num: float

    location_grouped: str
    Furnishing: str
    Transaction: str
    Ownership: str
    facing: str


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/locations")
def get_locations():
    return {
        "locations": locations
    }


@app.post("/predict")
def predict(data: HouseData):

    input_data = pd.DataFrame([{
        "carpet_area_sqft": data.carpet_area_sqft,
        "floor_num": data.floor_num,
        "Bathroom": data.bathroom,
        "balcony_num": data.balcony_num,

        "location_grouped": data.location_grouped,
        "Furnishing": data.Furnishing,
        "Transaction": data.Transaction,
        "Ownership": data.Ownership,
        "facing": data.facing
    }])

    prediction = model.predict(input_data)[0]

    return {
        "predicted_price": round(float(prediction), 2),
        "currency": "INR"
    }