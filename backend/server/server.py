# backend/server.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from io import BytesIO
from PIL import Image
import numpy as np

app = FastAPI(title="Bone Fracture Detection API", version="1.0")

# Allow Vite dev ports (5173–5175) for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running. See /docs"}

@app.get("/health")
def health():
    return {"status": "ok"}

# --- Load your YOLO model once at startup ---
MODEL_PATH = r"C:\Final project 2\backend\models\best.pt"  # <-- adjust if needed
model = YOLO(MODEL_PATH)  # uses GPU if available (device=0 by default if CUDA)

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    conf: float = Query(0.25, ge=0.0, le=1.0, description="Confidence threshold (0..1)")
):
    """
    Accepts an image and returns YOLO detections.
    Query: /predict?conf=0.55  (example)
    """
    try:
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        np_img = np.array(image)

        # Run inference with requested confidence
        results = model.predict(source=np_img, conf=conf, imgsz=640)  # device auto
        r = results[0]

        detections = []
        fracture_types = set()

        for box in r.boxes:
            x1, y1, x2, y2 = map(float, box.xyxy[0])   # absolute (px)
            cls_id = int(box.cls[0])
            score = float(box.conf[0])
            class_name = model.names.get(cls_id, str(cls_id))

            detections.append({
                "box": [x1, y1, x2, y2],       # [x1,y1,x2,y2] absolute pixels
                "cls": cls_id,
                "class_name": class_name,
                "score": score
            })
            fracture_types.add(class_name)

        return {
            "filename": file.filename,
            "width": image.width,
            "height": image.height,
            "detections": detections,
            "summary": {
                "fractured": len(detections) > 0,
                "types": sorted(list(fracture_types))
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
