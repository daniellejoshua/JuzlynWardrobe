from fastapi import APIRouter,HTTPException
from app.services.database import get_models_by_user_id


router = APIRouter()
@router.get("/")
def list_model(user_id="00000000-0000-0000-0000-000000000000"):
    try:
        items = get_models_by_user_id(user_id=user_id)
        return {"models":items}
    except Exception as e: 
       raise HTTPException(500,detail=str(e))