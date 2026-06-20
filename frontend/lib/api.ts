const API_URL = process.env.API_URL || "http://localhost:8000";

export async function getOutfits() {
  const res = await fetch(`${API_URL}/outfits`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch outfits");
  return res.json(); // { outfits: [...] }
}

export async function generateCombinations(outfitIds: string[]) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfits_ids: outfitIds }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate combinations");
  return res.json(); // { combinations: [...] }
}
