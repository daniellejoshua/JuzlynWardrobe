from app.auth.dependencies import get_current_user
from app.services.database import get_outfits_by_ids, get_outfits_by_user_id
from app.services.gemini import generate_combinations
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter()


class GenerateRequest(BaseModel):
    outfits_ids: list[str]
    model_id: str | None = None


@router.post("/")
def generate(request: GenerateRequest, user_id: str = Depends(get_current_user)):
    try:
        selected = get_outfits_by_ids(request.outfits_ids)
        if not selected:
            raise HTTPException(500, "No outfits found on given id")
        all_items = get_outfits_by_user_id(user_id)
        combination = generate_combinations(selected, all_items)
        return {"combinations": combination}
    except Exception as e:
        raise HTTPException(500, str(e))
