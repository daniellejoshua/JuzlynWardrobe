import json

from app.services.database import get_outfits_by_ids
from app.services.tryon import LocalFashnVtonService
from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile

router = APIRouter()
service = LocalFashnVtonService()


@router.post("")
async def try_on(person_image: UploadFile = File(...), outfit_ids: str = Form(...)):
    if not person_image.content_type or not person_image.content_type.startswith(
        "image/"
    ):
        raise HTTPException(400, "File must be an Image")
    person_bytes = await person_image.read()
    if len(person_bytes) > 5 * 1024 * 1024:
        raise HTTPException(400, "Image must be under 5mb")
    try:
        ids = json.loads(outfit_ids)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid JSON for outfit_ids: {e.msg}"
        )
    if not ids:
        raise HTTPException(404, "Select atleast 1 item")
    outfits = get_outfits_by_ids(ids)
    if not outfits:
        raise HTTPException(401, "No outfits found on the selected ID")

    items = [{"image_url": o["image_url"], "category": o["clothing_type"]} for o in outfits ]  # type: ignore  # fmt: skip
    result_bytes = service.try_on_combo(person_bytes, items)
    return Response(content=result_bytes, media_type="image/png")
