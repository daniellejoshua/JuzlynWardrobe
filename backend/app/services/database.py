from app.services.supabase_client import supabase
import json
def create_outfit(image_url, clothing_type, category,name, user_id="00000000-0000-0000-0000-000000000000", primary_color=None, style_tags=None, occasion=None):
    data ={
        "image_url":image_url,
        "user_id": user_id,
        "clothing_type":clothing_type,
        "category":category,
        "name":name
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
        response = supabase.table("outfits").select("*").in_("id",outfits_ids).execute()
        if not response.data:
            return []
        return response.data
    except Exception as e:
        raise Exception(str(e))
def get_outfits_by_user_id(user_id="00000000-0000-0000-0000-000000000000"):
    try:
        response = supabase.table("outfits").select("*").eq("user_id",user_id).execute()
        return response.data or []
    except Exception as e: 
        raise Exception(str(e))
    

def upload_model(name,storage_path,file_size,version=None, user_id="00000000-0000-0000-0000-000000000000", status="pending"):
    data = {
        "storage_path":storage_path,
        "name":name,
        "file_size":file_size,
        "user_id":user_id,
        "status":status
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
    
def get_models_by_user_id(user_id="00000000-0000-0000-0000-000000000000"):
    try:
        response = supabase.table("models").select("*").eq("user_id",user_id).execute()
        return response.data or []
    except Exception as e: 
        raise Exception(str(e))