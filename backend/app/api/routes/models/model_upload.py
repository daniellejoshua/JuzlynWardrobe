from app.auth.dependencies import get_current_user
from app.services.database import upload_model
from app.services.storage import upload_model as upload_model_storage
from app.services.supabase_client import supabase
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

router = APIRouter()


@router.post("/")
async def upload_models_to_db_bucket(
    file: UploadFile = File(...),
    name: str = Form(...),
    version: str = Form(None),
    user_id: str = Depends(get_current_user),
):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be png or jpg")
    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(400, "Image must be under 5mb")
    storage_path = ""
    try:
        record = upload_model(
            user_id,
            name=name,
            storage_path=storage_path,
            file_size=len(file_bytes),
            version=version,
            status="pending",
        )
        record_id = record["id"]  # type: ignore
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    try:
        _, storage_path = upload_model_storage(
            file_bytes, file.filename or "upload.png", file.content_type
        )
    except Exception as e:
        supabase.table("models").delete().eq("id", record_id).execute()
        raise HTTPException(500, detail=str(e))

    try:
        result = (
            supabase.table("models")
            .update({"status": "completed", "storage_path": storage_path})
            .eq("id", record_id)
            .execute()
        )

    except Exception as e:
        raise HTTPException(500, detail=(str(e)))
    return result.data[0]
