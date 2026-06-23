const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getOutfits() {
  const res = await fetch(`${API_URL}/outfits`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch outfits");
  return res.json();
}

export async function generateCombinations(outfitIds: string[]) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfits_ids: outfitIds }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate combinations");
  return res.json();
}

export async function uploadOutfit(formData: FormData) {
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to Upload");
  return res.json();
}
