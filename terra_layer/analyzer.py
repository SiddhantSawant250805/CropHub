import os
import io
import cv2
import json
import logging
import requests
import numpy as np
from PIL import Image
try:
    from tensorflow.keras.models import load_model # type: ignore
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input # type: ignore
except ImportError:
    load_model = None
    preprocess_input = None

logger = logging.getLogger(__name__)

class TerraAnalyzer:
    def __init__(self, model_path="model.h5"):
        self.model_path = model_path
        self.soil_classes = ['Alluvial_Soil', 'Arid_Soil', 'Black_Soil', 'Laterite_Soil', 'Mountain_Soil', 'Red_Soil', 'Yellow_Soil']
        self.model = None
        if load_model:
            try:
                if os.path.exists(self.model_path):
                    self.model = load_model(self.model_path)
                    logger.info("MobileNetV2 Model loaded successfully.")
                else:
                    logger.warning(f"Model {self.model_path} not found. Please follow ARRANGEMENTS.md to add it.")
            except Exception as e:
                logger.error(f"Error loading model: {e}")

    def fetch_weather_data(self, lat: float, lon: float):
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,precipitation&hourly=temperature_2m,precipitation"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            return {
                "temp_c": data.get("current", {}).get("temperature_2m", 25),
                "rain_mm": data.get("current", {}).get("precipitation", 0.0)
            }
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            return {"temp_c": 25, "rain_mm": 0.0}

    def fetch_soil_grids_data(self, lat: float, lon: float):
        # Fetching ISRIC SoilGrids data (mocked format from their API)
        try:
            url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}&property=phh2o&property=nitrogen&depth=0-5cm&value=mean"
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                # The actual response format is complex, mocking the extraction for demo
                return {"N": 40, "P": 30, "K": 20, "pH": 6.5}
            else:
                return {"N": 50, "P": 25, "K": 35, "pH": 6.8}
        except Exception as e:
            logger.error(f"Error fetching SoilGrids data: {e}")
            return {"N": 50, "P": 25, "K": 35, "pH": 6.8}

    def analyze_image_opencv(self, image_bytes: bytes):
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            img_np = np.array(image)
            # Convert RGB to BGR for OpenCV
            img_bgr = img_np[:, :, ::-1].copy()
            # Calculate HSV average
            hsv_img = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
            avg_hsv = np.mean(hsv_img, axis=(0, 1))
            
            # Simple graininess estimate using laplacian variance
            graininess = cv2.Laplacian(img_bgr, cv2.CV_64F).var()
            
            # MobileNet prediction
            predicted_soil_type = "Unknown"
            if self.model and preprocess_input:
                resized = cv2.resize(img_bgr, (224, 224))
                input_arr = preprocess_input(np.expand_dims(resized, axis=0))
                preds = self.model.predict(input_arr)
                predicted_soil_type = self.soil_classes[np.argmax(preds)]
            else:
                predicted_soil_type = "Loam (Mock - Model missing)"

            return {
                "color_hsv": {"H": avg_hsv[0], "S": avg_hsv[1], "V": avg_hsv[2]},
                "graininess": graininess,
                "cnn_soil_type_prediction": predicted_soil_type
            }
        except Exception as e:
            logger.error(f"Image analysis error: {e}")
            return {"color_hsv": {"H": 0, "S": 0, "V": 0}, "graininess": 0.0, "cnn_soil_type_prediction": "Error processing image"}

    def generate_report(self, lat: float, lon: float, survey: dict, image_bytes: bytes = None):
        # 1. Fetch real-time data
        weather = self.fetch_weather_data(lat, lon)
        location_data = self.fetch_soil_grids_data(lat, lon)
        
        # 2. Analyze Image
        image_data = {"cnn_soil_type_prediction": "None", "graininess": 0.0}
        if image_bytes:
            image_data = self.analyze_image_opencv(image_bytes)
        
        # Extract inputs
        survey_texture = survey.get("texture", "Unknown")
        survey_wetness = int(survey.get("wetness", 5)) # 1-10 scale
        image_texture = "Smooth" if image_data.get("graininess", 0) < 500 else "Grainy"
        ph = location_data.get("pH", 7.0)
        temp_c = weather.get("temp_c", 20.0)
        rain_mm = weather.get("rain_mm", 0.0)

        # Build The "So What?" Summary
        if 6.0 <= ph <= 7.0:
            health_status = "Optimal"
            key_interpretation = f"Your pH is {ph}, meaning nutrients are perfectly unlocked for your plants. NPK levels are balanced."
        elif ph < 6.0:
            health_status = "Imbalanced"
            key_interpretation = f"Your soil is acidic (pH {ph}). This locks up vital nutrients like phosphorus."
        else:
            health_status = "Deficient"
            key_interpretation = f"High alkalinity (pH {ph}) is likely causing iron and manganese deficiency in your plants."

        # Weather-Soil Synthesis
        hydrology_alert = "Conditions are stable."
        workability_window = "Soil is prime for working over the next 48 hours."
        
        if survey_wetness >= 8 and rain_mm > 5:
            hydrology_alert = f"**Critical Warn: Flooding/Runoff Risk.** Manual moisture is high ({survey_wetness}/10) and {rain_mm}mm rain is expected."
            workability_window = "**Avoid all tilling and heavy machinery** to prevent severe soil compaction and structure destruction."
        elif (survey_texture.lower() == 'clay' or image_texture == 'Smooth') and rain_mm > 10:
            hydrology_alert = "**Warn: Compaction/Drainage Risk.** Heavy clay properties combined with incoming rain."
            workability_window = "**Avoid tilling today** due to high moisture; wait 48 hours to prevent severe compaction."
        elif survey_wetness <= 3 and temp_c > 30:
            hydrology_alert = f"**Warn: Severe Drought Stress.** Manual moisture is critically low ({survey_wetness}/10) with extreme heat ({temp_c}°C)."
            workability_window = "Prioritize deep and immediate irrigation to salvage root structures."
        elif (survey_texture.lower() == 'sand' or image_texture == 'Grainy') and temp_c > 32:
            hydrology_alert = "**Warn: Moisture Stress Risk.** Sandy soil drains fast, and the high heat will evaporate remaining moisture."
            workability_window = "Prioritize deep watering immediately. Early morning or late evening is best."

        # Personalized Crop Matchmaker
        if health_status == "Optimal":
            ideal_crops = ["**Tomatoes**", "**Bell Peppers**", "**Corn**"]
            warning_crop = "**Blueberries** (Require highly acidic soil)"
        elif ph < 6.0:
            ideal_crops = ["**Blueberries**", "**Potatoes**", "**Radishes**"]
            warning_crop = "**Asparagus** (Struggles in acidic soil)"
        else:
            ideal_crops = ["**Asparagus**", "**Cabbage**", "**Leeks**"]
            warning_crop = "**Potatoes** (Prone to scab in alkaline soil)"

        # The 72-Hour Action Plan
        action_plan = []
        if rain_mm > 10 or survey_wetness >= 8:
            action_plan.append("Suspend any scheduled fertilizer application to prevent nutrient runoff.")
            action_plan.append("Ensure drainage channels or furrows are clear before the rain begins.")
        elif temp_c > 32 or survey_wetness <= 3:
            action_plan.append("Because soil moisture is low and heat is imminent, apply 2 inches of mulch today.")
            action_plan.append("Irrigate deeply at the root zone rather than overhead.")
        else:
            action_plan.append("Current weather supports light top-dressing of organic compost if needed.")
            action_plan.append("Monitor soil moisture levels manually before watering.")

        action_plan.append(f"Based on the {survey_texture} texture, consider long-term amendments like cover cropping this fall.")

        return {
            "health_status": health_status,
            "key_interpretation": key_interpretation,
            "hydrology_alert": hydrology_alert,
            "workability_window": workability_window,
            "ideal_crops": ideal_crops,
            "warning_crop": warning_crop,
            "action_plan": action_plan
        }
