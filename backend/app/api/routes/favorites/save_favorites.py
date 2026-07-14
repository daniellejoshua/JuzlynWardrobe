from fastapi import UploadFile, HTTPException, APIRouter, Depends, File, Form
from app.auth.dependencies import get_current_user
import json
from app.services.storage import upload_tryon_result
from app.services.database import save_to_favorites

router = APIRouter()


@router.post("/")
async def saveToFavorites(
    user_id: str = Depends(get_current_user),
    savedImage: UploadFile = File(...),
    outfit_ids: str = Form(...),
    combo_name: str | None = Form(None),
    combo_description: str | None = Form(None),
):
    if not savedImage.content_type or not savedImage.content_type.startswith("image/"):
        raise HTTPException(400, "File must be png or jpg ")

    file_bytes = await savedImage.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(400, "Image must be under 5mb")
    try:
        ids = json.loads(outfit_ids)
        if not ids:
            raise HTTPException(400, "Atleast one Outfits is Required")
    except json.JSONDecodeError as e:
        raise HTTPException(400, f"Error on parsing outfits_ids {e.msg}")

    try:
        public_url, unique_name = upload_tryon_result(
            file_bytes, savedImage.filename or "upload.png", savedImage.content_type
        )
    except Exception as e:
        raise HTTPException(400, f"Error on uploading to the bucket {e}")
    try:
        result = save_to_favorites(
            user_id, public_url, ids, combo_name, combo_description
        )
    except Exception as e:
        raise HTTPException(400, f"Error on Inserting to the table {e}")
    return result[0]
