# CropHub Terra Layer (Intelligence Engine)

The Terra Layer is a Python-based microservice that provides the "brain" for the CropHub system. It handles complex tasks such as soil type classification using Computer Vision (OpenCV) and Machine Learning (MobileNetV2), as well as real-time weather and agronomy analysis.

---

## 🔥 Features

- **Soil Classification**: Uses a fine-tuned MobileNetV2 model to predict soil types from uploaded images.
- **Deep Analysis**: Breaks down composition (topsoil, clay, sand, silt, organic) and provides NPK/pH insights.
- **Weather Integration**: Fetches real-time environmental data for the specific farm location.
- **API (FastAPI)**: Lightweight and high-performance asynchronous API for backend communication.

---

## 🛠️ Setup & Installation

### 1. Create Virtual Environment
It is highly recommended to isolate the Python dependencies.
```bash
cd terra_layer
python -m venv venv
```

### 2. Activate Virtual Environment
- **Windows**: `.\venv\Scripts\activate`
- **Mac/Linux**: `source venv/bin/activate`

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
Create a `.env` file in the `terra_layer` directory.
**Required Variables:**
- `OPEN_METEO_URL`: (Optional) Custom weather API endpoint.
- `BOTO3_ACCESS_KEY` / `BOTO3_SECRET_KEY`: For downloading assets from S3.

### 5. Run the Service
```bash
uvicorn main:app --reload --port 8000
```
The service will be accessible at `http://localhost:8000`.

---

## 📦 Required External Assets

Due to their considerable size, the following critical assets must be fetched manually.

> [!IMPORTANT]
> **Drive Repository:** [https://drive.google.com/drive/folders/1x_sWvpO8PtXFJMgMUcmh0GAMXblFgMxS?usp=drive_link]
> (Note: Contact the system administrator for the specific encrypted link)

| Asset Name | Target Destination | Functional Purpose |
| :--- | :--- | :--- |
| `model.h5` | `terra_layer/model.h5` | Fine-tuned MobileNetV2 soil vision weights for classification. |
| `dataset/` | `terra_layer/dataset/` | The core labeled dataset utilized for ongoing training and refinement. |

---

## 🦾 ML Pipeline Context

- **Classification Architecture**: A custom-head MobileNetV2 CNN, optimized for feature extraction on agricultural telemetry.
- **Performance Optimization**: Implements image resizing and normalization via OpenCV to reduce inference latency under high load.
- **Weather Enrichment**: Uses the **Open-Meteo** historical and atmospheric API to synthesize soil diagnostics with environmental context.

---

## 📄 License
MIT — Intelligence for Sustainable Decisions.
