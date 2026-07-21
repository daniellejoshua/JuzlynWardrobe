from dotenv import load_dotenv


load_dotenv("../.env")

from app.api.routes import generate, tryon  # noqa: E402
from app.api.routes.models import getModels, model_upload  # noqa: E402
from app.api.routes.favorites import get_favorites, save_favorites, delete_favorites  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from app.api.routes.outfits import outfits  # noqa: E402
from app.api.routes.outfits import outfit_upload  # noqa: E402
from app.api.routes.outfits import delete_outfits  # noqa:E402

app = FastAPI(title="AI WARDROBE STYLIST API")


# Allow frontend (Vercel) to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(outfit_upload.router, prefix="/upload", tags=["Upload"])
app.include_router(generate.router, prefix="/generate", tags=["Generate"])
app.include_router(outfits.router, prefix="/outfits", tags=["getAllOutfits"])
app.include_router(tryon.router, prefix="/tryon", tags=["tryonCombo"])
app.include_router(getModels.router, prefix="/models")
app.include_router(model_upload.router, prefix="/models/upload")
app.include_router(save_favorites.router, prefix="/favorites/save")
app.include_router(get_favorites.router, prefix="/favorites")
app.include_router(delete_favorites.router, prefix="/favorites")
app.include_router(delete_outfits.router, prefix="/outfits")


@app.get("/")
def root():
    return {"message": "AI WARDROBE STYLIST API"}
