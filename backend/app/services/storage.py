from app.services.supabase_client import supabase
import uuid

def upload_image(file_bytes:bytes,file_name:str,content_type:str)->tuple:

    try:
        unique_name = f"{uuid.uuid4()}_{file_name}"
        response = supabase.storage.from_("outfit-images").upload(
            unique_name, file_bytes, {"content-type": content_type}
        )
    except Exception:
        raise Exception("Upload Failed")

    public_url = supabase.storage.from_("outfit-images").get_public_url(unique_name)
    return (public_url,unique_name)
