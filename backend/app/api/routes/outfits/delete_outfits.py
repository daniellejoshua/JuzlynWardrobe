from fastapi import APIRouter, Depends, HTTPException
from app.services.database import delete_outfits
from app.auth.dependencies import get_current_user
from app.services.supabase_client import supabase


router = APIRouter()


@router.delete("/{outfits_ids}")
async def deleteOutfits(outfits_ids: str, user_id: str = Depends(get_current_user)):
    try:
        storage_path = delete_outfits(user_id, outfits_ids)
        supabase.storage.from_("outfit-images").remove([storage_path])
        return {"message": "Outfits Deleted Successfully"}
    except Exception as e:
        raise HTTPException(400, detail=str(e))
