from fastapi import APIRouter, Form, File, HTTPException, UploadFile, Depends
from app.services.database import create_outfit
from app.services.storage import upload_image
from app.services.supabase_client import supabase
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.post("/")
async def upload_outfit(
    file: UploadFile = File(...),
    clothing_type: str = Form(...),
    category: str = Form(...),
    primary_color: str = Form(None),
    style_tags: str = Form(None),
    occasion: str = Form(None),
    name: str = Form(None),
    user_id: str = Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "FILE EXTENSION MUST BE PNG/JPG")

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(400, "Files mus be under 5mb")

    storage_path = ""

    try:
        image_url, storage_path = upload_image(
            file_bytes, file.filename or "upload.jpg", file.content_type
        )

    except Exception as e:
        raise HTTPException(500, detail=str(e))

    try:
        outfit = create_outfit(
            image_url=image_url,
            storage_path=storage_path,
            clothing_type=clothing_type,
            category=category,
            primary_color=primary_color,
            style_tags=style_tags,
            occasion=occasion,
            name=name,
            user_id=user_id,
        )
    except Exception as e:
        if storage_path:
            supabase.storage.from_("outfit-images").remove([storage_path])
        raise HTTPException(500, detail=str(e))

    return {"outfit_id": outfit["id"], "image_url": image_url}  # type:ignore
