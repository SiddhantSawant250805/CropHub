from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json
from analyzer import TerraAnalyzer

app = FastAPI(title="Terra Layer Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = TerraAnalyzer()

@app.post("/api/analyze")
async def analyze_soil(
    lat: float = Form(...),
    lon: float = Form(...),
    survey: str = Form(...), # JSON string
    image: UploadFile = File(None)
):
    try:
        survey_dict = json.loads(survey)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid survey JSON")
    
    image_bytes = None
    if image:
        image_bytes = await image.read()

    try:
        report = analyzer.generate_report(lat=lat, lon=lon, survey=survey_dict, image_bytes=image_bytes)
        return {"success": True, "report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
