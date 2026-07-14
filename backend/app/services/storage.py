from app.services.supabase_client import supabase
import uuid


def upload_image(file_bytes: bytes, file_name: str, content_type: str) -> tuple:

    try:
        unique_name = f"{uuid.uuid4()}_{file_name}"
        _ = supabase.storage.from_("outfit-images").upload(
            unique_name, file_bytes, {"content-type": content_type}
        )
    except Exception as e:
        raise Exception(f"Upload Failed {e}")

    public_url = supabase.storage.from_("outfit-images").get_public_url(unique_name)
    return (public_url, unique_name)


def upload_model(file_bytes: bytes, file_name: str, content_type: str) -> tuple:

    try:
        unique_name = f"{uuid.uuid4()}_{file_name}"
        _ = supabase.storage.from_("model-photos").upload(
            unique_name, file_bytes, {"content-type": content_type}
        )
    except Exception as e:
        raise Exception(f"Upload Failed {e}")

    public_url = supabase.storage.from_("model-photos").get_public_url(unique_name)
    return (public_url, unique_name)


def upload_tryon_result(file_bytes: bytes, file_name: str, content_type: str) -> tuple:

    try:
        unique_name = f"{uuid.uuid4()}_{file_name}"
        _ = supabase.storage.from_("tryon-result").upload(
            unique_name, file_bytes, {"content-type": content_type}
        )
    except Exception as e:
        raise Exception(f"Upload Failed {e}")

    public_url = supabase.storage.from_("tryon-result").get_public_url(unique_name)
    return (public_url, unique_name)
