from fastapi import APIRouter, HTTPException, Depends
from app.services.database import get_outfits_by_user_id
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/")
def list_outfits(user_id: str = Depends(get_current_user)):
    try:
        items = get_outfits_by_user_id(user_id)
        return {"outfits": items}
    except Exception as e:
        raise HTTPException(500, detail=(str(e)))
