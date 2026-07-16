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
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/outfits`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    cache: "no-store"
  }
  );
  if (!res.ok) throw new Error("Failed to fetch outfits");
  return res.json();
}

export async function generateCombinations(outfitIds: string[], modelId?: string) {
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ outfits_ids: outfitIds, model_id: modelId }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to generate combinations");
  return res.json();
}

export async function getModels() {
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/models`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    cache: "no-store"
  });
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
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to Upload");
  return res.json();
}
export async function uploadModel(formData: FormData) {
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/models/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getFavorites()