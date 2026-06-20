# Frontend Architecture — AI Wardrobe Stylist

## Tech Stack
- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Dependencies already installed: `axios`, `react-dropzone`, `swr`, `@supabase/supabase-js`

## Architecture — Server + Client Components

Server components fetch data and render HTML. Client components handle interactivity (file upload, form input, button clicks).

```
lib/
├── api.ts           — server-side fetch() calls for server components

app/
├── layout.tsx        → SERVER: Navbar wrapper + metadata
├── page.tsx          → SERVER: dashboard with summary stats
├── upload/
│   ├── page.tsx      → SERVER: wrapper (renders UploadForm)
│   └── UploadForm.tsx → CLIENT: react-dropzone + form fields
├── wardrobe/
│   └── page.tsx      → SERVER: fetch outfits, render card grid
├── generate/
│   ├── page.tsx      → SERVER: fetch all outfits, render selector
│   └── GeneratePanel.tsx → CLIENT: selection + generate + results display
└── favorites/
    └── page.tsx      → SERVER: placeholder page

components/
├── Navbar.tsx       → CLIENT: top nav with links
└── ClothingCard.tsx  → SERVER: single item card (image + metadata)
```

## Data Flow

**Server components** use `fetch()` via `lib/api.ts` — no client JS needed:

```typescript
// lib/api.ts
const API_URL = process.env.API_URL || "http://localhost:8000"

export async function getOutfits() {
  const res = await fetch(`${API_URL}/outfits`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch outfits")
  return res.json()
}

export async function generateCombinations(outfitIds: string[]) {
  const res = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ outfits_ids: outfitIds }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to generate combinations")
  return res.json()
}
```

**Client components** handle mutations (upload file, generate button). They call the same API endpoints directly.

## Backend Endpoints Consumed

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/upload` | Upload clothing image + form data |
| GET | `/outfits` | List all outfits for the wardrobe grid |
| POST | `/generate` | Generate outfit combinations from selected IDs |

## Pages

### `/` — Home Dashboard
- Quick actions: Upload new item, View wardrobe, Generate outfit
- Summary stats (optional): total items, recent uploads

### `/upload` — Upload Clothing
- Server component wrapper
- Client `UploadForm.tsx`: drag-and-drop zone (react-dropzone) + form fields:
  - clothing_type (text), category (select), primary_color (text), style_tags (text), occasion (text)
- On submit → POST /upload with FormData → redirect to /wardrobe

### `/wardrobe` — Wardrobe Grid
- Server component fetches all outfits via `GET /outfits`
- Renders grid of `ClothingCard` components
- Each card shows: image, clothing type, color, category
- Cards are selectable with checkboxes
- "Generate combination" button navigates to `/generate?selected=id1,id2`

### `/generate` — Generate Combinations
- Server component fetches all outfits
- Renders selectable wardrobe grid + "Generate" button
- Client `GeneratePanel.tsx` handles selection state and POST /generate
- Results displayed as combination cards showing: name, description, and which items are used

### `/favorites` — Favorites (placeholder)
- Empty page for future feature

## File Creation Order

| # | File | Type | What it does |
|---|------|------|-------------|
| 1 | `lib/api.ts` | Shared | `getOutfits()`, `generateCombinations(ids)` — fetch wrappers |
| 2 | `app/layout.tsx` | Server | Update title, add Navbar wrapper |
| 3 | `components/Navbar.tsx` | Client | Nav links: Home, Upload, Wardrobe, Generate |
| 4 | `app/page.tsx` | Server | Dashboard with quick actions |
| 5 | `app/wardrobe/page.tsx` | Server | Fetches outfits, renders image grid |
| 6 | `components/ClothingCard.tsx` | Server | Single item card |
| 7 | `app/upload/page.tsx` | Server | Renders UploadForm |
| 8 | `app/upload/UploadForm.tsx` | Client | react-dropzone + form → POST /upload |
| 9 | `app/generate/page.tsx` | Server | Fetches outfits, renders GeneratePanel |
| 10 | `app/generate/GeneratePanel.tsx` | Client | Select items → POST /generate → show results |
| 11 | `app/favorites/page.tsx` | Server | Placeholder page |

## Env Variables

```env
# .env.local (frontend)
API_URL=http://localhost:8000
```

`API_URL` is server-side only (not `NEXT_PUBLIC_`). On Vercel, set it to the Render backend URL.

## Auth (Future)

Supabase Auth (Google OAuth) will be added later. When implemented:
1. `lib/supabase.ts` will initialize the Supabase client
2. Auth middleware will protect routes
3. `user_id` will switch from dummy UUID to real user IDs
