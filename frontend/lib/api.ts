import { createClient } from "./supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


async function getAccessToken(): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? ""
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = await getAccessToken()
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    },
  });
}


export async function getOutfits() {
  const res = await authFetch("/outfits");
  if (!res.ok) throw new Error("Failed to fetch outfits");
  return res.json();
}

export async function generateCombinations(outfitIds: string[], modelId?: string) {
  const res = await authFetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfits_ids: outfitIds, model_id: modelId }),
  });
  if (!res.ok) throw new Error("Failed to generate combinations");
  return res.json();
}

export async function getModels() {
  const res = await authFetch("/models");
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
  const res = await authFetch("/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to Upload");
  return res.json();
}
export async function uploadModel(formData: FormData) {
  const res = await authFetch("/models/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getFavorites(page = 1, limit = 10) {
  const res = await authFetch(`/favorites?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function saveFavorite(formData: FormData) {
  const res = await authFetch("/favorites/save", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to save favorite");
  return res.json();
}

export async function deleteFavorites(favoriteID: string[]) {
  const res = await authFetch(`/favorites`, { method: "DELETE", headers: { "Content-type": "application/json" }, body: JSON.stringify(favoriteID) })
  if (!res.ok) throw new Error("Failed to delete Favorites");
  return res.json()
}

export async function deleteOutfits(outfitsID: string[]) {
  const res = await authFetch(`/outfits`, { method: "DELETE", headers: { "Content-type": "application/json" }, body: JSON.stringify(outfitsID) })
  if (!res.ok) throw new Error("Failed to delete outfits");
  return res.json()
}