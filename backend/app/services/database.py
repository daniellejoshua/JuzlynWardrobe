from app.services.supabase_client import supabase
from postgrest import CountMethod


def create_outfit(
    image_url,
    clothing_type,
    category,
    name,
    user_id,
    primary_color=None,
    style_tags=None,
    occasion=None,
):

    data = {
        "image_url": image_url,
        "user_id": user_id,
        "clothing_type": clothing_type,
        "category": category,
        "name": name,
    }
    if primary_color:
        data["primary_color"] = primary_color
    if style_tags:
        data["style_tags"] = style_tags.split(",")
    if occasion:
        data["occasion"] = occasion
    try:
        response = supabase.table("outfits").insert(data).execute()
        if not response.data:
            raise Exception("Insert returned no data")
        return response.data[0]
    except Exception as e:
        raise Exception(str(e))


def get_outfits_by_ids(outfits_ids):
    try:
        response = (
            supabase.table("outfits").select("*").in_("id", outfits_ids).execute()
        )
        if not response.data:
            return []
        return response.data
    except Exception as e:
        raise Exception(str(e))


def get_outfits_by_user_id(user_id):
    try:
        response = (
            supabase.table("outfits").select("*").eq("user_id", user_id).execute()
        )
        return response.data or []
    except Exception as e:
        raise Exception(str(e))


def upload_model(
    user_id, name, storage_path, file_size, version=None, status="pending"
):
    data = {
        "storage_path": storage_path,
        "name": name,
        "file_size": file_size,
        "user_id": user_id,
        "status": status,
    }
    if version:
        data["version"] = version
    try:
        response = supabase.table("models").insert(data).execute()
        if not response.data:
            raise Exception("Insert model returned no data")
        return response.data[0]
    except Exception as e:
        raise Exception(str(e))


def get_models_by_user_id(user_id):
    try:
        response = supabase.table("models").select("*").eq("user_id", user_id).execute()
        return response.data or []
    except Exception as e:
        raise Exception(str(e))


def save_to_favorites(user_id, image_url, outfit_ids, combo_name, combo_description):
    data = {"user_id": user_id, "image_url": image_url, "outfit_ids": outfit_ids}
    if combo_name:
        data["combo_name"] = combo_name
    if combo_description:
        data["combo_description"] = combo_description
    try:
        response = supabase.table("favorites").insert(data).execute()  # type:ignore
        if not response.data:
            raise Exception("Insert to Favorites table error")
        return response.data or []
    except Exception as e:
        raise Exception(str(e))


def get_favorites_by_user_id(user_id, offset=0, limit=10):
    try:
        end = offset + limit - 1
        response = (
            supabase.table("favorites")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .range(offset, end)
            .execute()
        )
        data = response.data or []
        return (data, len(data) == limit)
    except Exception as e:
        raise Exception(str(e))
