from abc import ABC, abstractmethod
from io import BytesIO

import requests
import torch
from PIL import Image

WEIGHTS_DIR = "fashn-vton-1.5/weights"

CLOTHING_TYPE_TO_PIPELINE_CATEGORY = {
    "Top": "tops",
    "Jacket": "tops",
    "Outerwear": "tops",
    "Bottom": "bottoms",
    "Dress": "one-pieces",
}


class TryOnService(ABC):
    @abstractmethod
    def try_on_garment(
        self, person_bytes: bytes, garment_bytes: bytes, category: str, *, segmentation_free: bool = True
    ) -> bytes:
        """Single garment try-on. Returns PNG bytes."""
        ...

    def try_on_combo(self, person_bytes: bytes, items: list[dict]) -> bytes:
        """Chain multiple garments sequentially (top → bottom).
        items: [{image_url: str, category: str}]
        Returns final composited PNG bytes."""
        PIPELINE_ORDER = {"tops": 0, "one-pieces": 0, "bottoms": 1}
        vton_items = [
            item
            for item in items
            if item["category"] in CLOTHING_TYPE_TO_PIPELINE_CATEGORY
        ]
        vton_items.sort(
            key=lambda x: PIPELINE_ORDER.get(
                CLOTHING_TYPE_TO_PIPELINE_CATEGORY[x["category"]], 0
            )
        )
        current = person_bytes
        is_combo = len(vton_items) > 1
        for item in vton_items:
            garment_bytes = download_image(item["image_url"])
            current = self.try_on_garment(
                current, garment_bytes, item["category"],
                segmentation_free=not is_combo,
            )
        return current


class LocalFashnVtonService(TryOnService):
    def __init__(self) -> None:
        self._pipeline = None

    def load_pipeline(self):
        if self._pipeline is not None:
            return self._pipeline
        from fashn_vton import TryOnPipeline

        try:
            self._pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR)
        except torch.cuda.OutOfMemoryError:
            self._pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR, device="cpu")
        return self._pipeline

    def try_on_garment(self, person_bytes, garment_bytes, category, *, segmentation_free=True):
        pipeline = self.load_pipeline()
        person = Image.open(BytesIO(person_bytes)).convert("RGB")
        garment = Image.open(BytesIO(garment_bytes)).convert("RGB")
        result = pipeline(
            person_image=person,
            garment_image=garment,
            category=CLOTHING_TYPE_TO_PIPELINE_CATEGORY.get(category, "tops"),  # type:ignore
            num_samples=1,
            num_timesteps=30,
            segmentation_free=segmentation_free,
        )

        buf = BytesIO()
        result.images[0].save(buf, format="PNG")
        return buf.getvalue()


def download_image(url: str) -> bytes:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.content

    # def __init__(self):
    #     self._pipeline = None

    # def _load_pipeline(self):
    #     if self._pipeline is not None:
    #         return self._pipeline
    #     from fashn_vton import TryOnPipeline
    #     try:
    #         self._pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR)
    #     except torch.cuda.OutOfMemoryError:
    #         self._pipeline = TryOnPipeline(weights_dir=WEIGHTS_DIR, device="cpu")
    #     return self._pipeline

    # def try_on_garment(self, person_bytes, garment_bytes, category):
    #     pipeline = self._load_pipeline()
    #     person = Image.open(BytesIO(person_bytes)).convert("RGB")
    #     garment = Image.open(BytesIO(garment_bytes)).convert("RGB")
    #     result = pipeline(
    #         person_image=person,
    #         garment_image=garment,
    #         category=category, # type: ignore
    #         num_samples=1,
    #         num_timesteps=30,
    #     )
    #     buf = BytesIO()
    #     result.images[0].save(buf, format="PNG")
    #     return buf.getvalue()


#
