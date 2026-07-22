from app.services.supabase_client import supabase


def create_outfit(
    image_url,
    storage_path,
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
        "storage_path": storage_path,
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


def check_duplicate_favorite(user_id, outfit_ids):
    try:
        response = (
            supabase.table("favorites")
            .select("*")
            .eq("user_id", user_id)
            .eq("outfit_ids", outfit_ids)
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception:
        return None


def save_to_favorites(
    user_id, image_url, storage_path, outfit_ids, combo_name, combo_description
):
    existing = check_duplicate_favorite(user_id, outfit_ids)
    if existing:
        return [existing]

    data = {
        "user_id": user_id,
        "storage_path": storage_path,
        "image_url": image_url,
        "outfit_ids": outfit_ids,
    }
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


def delete_favorites(user_id: str, favorite_id: list[str]) -> list[str]:
    response = (
        supabase.table("favorites")
        .select("storage_path")
        .in_("id", favorite_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not response.data:
        raise Exception("Favorites does not belogn to the user")
    storage_paths = [str(fav["storage_path"]) for fav in response.data]  # type:ignore
    supabase.table("favorites").delete().in_("id", favorite_id).execute()
    return storage_paths


def delete_outfits(user_id: str, outfit_ids: list[str]) -> list[str]:
    response = (
        supabase.table("outfits")
        .select("storage_path")
        .in_("id", outfit_ids)
        .eq("user_id", user_id)
        .execute()
    )
    if not response.data:
        raise Exception("Outfits does not belong to the user")
    storage_paths = [str(outfits["storage_path"]) for outfits in response.data]  # type: ignore
    supabase.table("outfits").delete().in_("id", outfit_ids).execute()
    return storage_paths
