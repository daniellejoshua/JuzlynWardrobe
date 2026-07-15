from fastapi import APIRouter, HTTPException, Depends, Query
from app.services.database import get_favorites_by_user_id
from app.auth.dependencies import get_current_user

from app.services.database import get_outfits_by_ids

router = APIRouter()


@router.get("/")
async def getFavorites(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    user_id: str = Depends(get_current_user),
):
    try:
        offset = (page - 1) * limit
        favorites, has_more = get_favorites_by_user_id(user_id, offset, limit)
        for fav in favorites:
            if fav["outfit_ids"]:  # type: ignore
                fav["outfits"] = get_outfits_by_ids(fav["outfit_ids"])  # type: ignore
        return {"favorites": favorites, "page": page, "has_more": has_more}
    except Exception as e:
        raise HTTPException(400, detail=str(e))
