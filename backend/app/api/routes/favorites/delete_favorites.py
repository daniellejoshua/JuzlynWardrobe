from fastapi import APIRouter, Depends, HTTPException
from app.services.database import delete_favorites
from app.auth.dependencies import get_current_user
from app.services.supabase_client import supabase

router = APIRouter()


@router.delete("/{favorite_id}")
async def deleteFavorites(favorite_id: str, user_id: str = Depends(get_current_user)):
    try:
        storage_paths = delete_favorites(user_id, [favorite_id])
        supabase.storage.from_("tryon-result").remove(storage_paths)
        return {"message": "Favorite Deleted Successfully"}
    except Exception as e:
        raise HTTPException(400, detail=str(e))
