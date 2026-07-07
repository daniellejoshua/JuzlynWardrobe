const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getOutfits() {
  const res = await fetch(`${API_URL}/outfits`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch outfits");
  return res.json();
}

export async function generateCombinations(outfitIds: string[], modelId?: string) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfits_ids: outfitIds, model_id: modelId }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate combinations");
  return res.json();
}

export async function getModels() {
  const res = await fetch(`${API_URL}/models`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

export async function tryOnCombo(modelStoragePath: string, outfitIds: string[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const modelRes = await fetch(`${supabaseUrl}/storage/v1/object/public/model-photos/${modelStoragePath}`);
  if (!modelRes.ok) throw new Error("Failed to fetch model image");
  const modelBlob = await modelRes.blob();

  const fd = new FormData();
  fd.append("person_image", modelBlob, "model.png");
  fd.append("outfit_ids", JSON.stringify(outfitIds));

  const res = await fetch(`${API_URL}/tryon`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Try-on failed");
  return res.blob();
}

export async function uploadOutfit(formData: FormData) {
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to Upload");
  return res.json();
}
