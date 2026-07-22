from fastapi import APIRouter, Depends, HTTPException, Body
from app.services.database import delete_outfits
from app.auth.dependencies import get_current_user
from app.services.supabase_client import supabase


router = APIRouter()


@router.delete("/")
async def deleteOutfits(
    outfits_ids: list[str] = Body(...), user_id: str = Depends(get_current_user)
):
    try:
        storage_paths = delete_outfits(user_id, outfits_ids)
        supabase.storage.from_("outfit-images").remove(storage_paths)
        return {"message": "Outfits Deleted Successfully"}
    except Exception as e:
        raise HTTPException(400, detail=str(e))
