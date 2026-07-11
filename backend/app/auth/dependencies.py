from fastapi import HTTPException, Header
from app.services.supabase_client import supabase

async def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(401,"Invalid Authorization Token")
    token = authorization.removeprefix("Bearer ")
    try:
        response = supabase.auth.get_user(token)
        if not response.user:# type: ignore[union-attr]
            raise HTTPException(401, "Invalid or Expired Token")
        return response.user.id# type: ignore[union-attr]
    except Exception as e:
        print(f"Auth Error={e}")
        raise HTTPException(401,"Invalid or Exired Token")
