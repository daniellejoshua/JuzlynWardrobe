from dotenv import load_dotenv
load_dotenv("../.env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import upload,generate

app = FastAPI(title="AI WARDROBE STYLIST API")


# Allow frontend (Vercel) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(generate.router, prefix="/generate", tags=["Generate"])

@app.get("/")
def root():
    return{"message": "AI WARDROBE STYLIST API"}
