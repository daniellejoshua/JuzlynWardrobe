from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from app.services.database import upload_model
from app.services.storage import upload_model as upload_model_storage
from app.services.supabase_client import supabase



router = APIRouter()
@router.post("/")
async def upload_models_to_db_bucket(
    file: UploadFile = File(...),
    name:  str = Form(...),
    version: str = Form(None)
):
        if not file.content_type or not file.content_type.startswith("image/"):
                raise HTTPException(400,"File must be png or jpg")
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:
                raise HTTPException(400, "Image must be under 5mb")
        unique_name = ""
        try:
            record = upload_model(name=name,storage_path=unique_name,file_size=len(file_bytes),version=version, status="pending")
            record_id = record["id"] # type: ignore
        except Exception as e:
            raise HTTPException(500, detail=str(e))
        try:
              public_url,unique_name = upload_model_storage(file_bytes,file.filename or "upload.png",file.content_type)
        except Exception as e:
              supabase.table("models").delete().eq("id",record_id).execute()
              raise HTTPException(500,detail=str(e))
        try:
              result = supabase.table("models")\
              .update({"status":"completed","storage_path":unique_name})\
              .eq("id",record_id).execute()
        except Exception as e: 
              raise HTTPException(500,detail=(str(e)))
        
        return result.data[0]