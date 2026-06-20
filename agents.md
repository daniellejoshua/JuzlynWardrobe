# AI Wardrobe Stylist - Agent Documentation

## Project Overview
A web application where users upload images of clothing items and manually specify clothing types to generate outfit combinations using AI (Gemini) and visualize them on a target body using IDM Veton.

## Tech Stack
- **Frontend**: Next.js 13+ (TypeScript), Tailwind CSS
- **Backend**: Python FastAPI
- **AI**: 
  - Google Gemini Free Tier for outfit combination generation
  - IDM Veton for garment visualization
- **Database/Auth/Storage**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Frontend on Vercel, Backend on Render/AWS/GCP

## Manual Input of Types (To Reduce AI Reliance)
To minimize AI usage and improve accuracy, users will manually input:
1. **Clothing Type**: (e.g., t-shirt, shirt, blouse, sweater, jeans, trousers, skirt, dress, shorts, jacket, coat)
2. **Category**: (e.g., top, bottom, outerwear, full-body)
3. **Primary Color**: (optional, for better matching)
4. **Style Tags**: (optional, e.g., casual, formal, sporty, vintage)
5. **Occasion**: (optional, e.g., work, party, workout, casual)

These inputs will be sent to the backend alongside the uploaded image to:
- Reduce the workload on Gemini (simpler prompts)
- Increase accuracy of outfit combinations
- Allow fallback rule-based combinations when API limits are reached

## Data Flow
1. User uploads clothing image (JPG/PNG) via frontend
2. User fills in manual type inputs (clothing type, category, etc.)
3. Frontend sends image and metadata to FastAPI backend
4. Backend:
   - Stores image in Supabase Storage
   - Saves metadata to Supabase DB
   - Calls Gemini API with prompt enhanced by manual inputs
   - Receives outfit combination suggestions from Gemini
   - For each combination, processes garment images through IDM Veton (using user-specified target body parameters or default)
   - Returns visualization URLs and combination data to frontend
5. Frontend displays generated combinations with visualizations

## Favorites Feature
Users can save generated outfit combinations as favorites for quick access without regenerating:
- Each combination visualization and metadata can be "favorited"
- Favorites are stored in the user's profile
- Frontend provides a "Favorites" tab/page to view saved combinations
- Reduces need for repeated AI calls and improves user experience
- Backend endpoint to toggle favorite status and retrieve user's favorites

## Key Components
### Frontend
- `components/UploadForm.tsx`: Image upload + type input form
- `components/OutfitDisplay.tsx`: Shows generated combinations
- `components/FavoritesList.tsx`: Displays user's favorite outfits
- `pages/index.tsx`: Main page
- `pages/favorites.tsx`: Favorites page
- `lib/supabase.ts`: Supabase client initialization
- `lib/api.ts`: Backend API calls

### Backend
- `main.py`: FastAPI app setup
- `routes/upload.py`: Image upload and metadata handling
- `routes/generate.py`: Gemini integration for combinations
- `routes/visualize.py`: IDM Veton processing
- `routes/favorites.py`: Favorite toggle and retrieval
- `services/gemini.py`: Gemini API wrapper
- `services/idm_veton.py`: Model loading and inference
- `services/storage.py`: Supabase Storage interactions
- `services/database.py`: Supabase DB operations

### Database Schema (Supabase)
```sql
-- users (from Supabase Auth)
-- outfits
CREATE TABLE outfits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT,
  clothing_type TEXT,
  category TEXT,
  primary_color TEXT,
  style_tags TEXT[],
  occasion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- combinations
CREATE TABLE combinations (
  id UUID PRIMARY KEY,
  base_outfit_id UUID REFERENCES outfits(id),
  user_id UUID REFERENCES auth.users(id),
  combination_data JSONB, -- Gemini output
  visualization_urls TEXT[], -- Supabase Storage URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  combination_id UUID REFERENCES combinations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, combination_id)
);
```

## Environment Variables
### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

## Development Workflow
1. Clone repository
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `pip install -r requirements.txt`
4. Set up Supabase project and copy credentials to .env files
5. Start backend: `uvicorn main:app --reload`
6. Start frontend: `npm run dev`
7. Upload test clothing items, input types, and verify combinations
8. Test favoriting combinations and viewing favorites page

## Deployment
- Frontend: Push to GitHub, connect to Vercel
- Backend: Deploy Docker container to Render/AWS ECP/GCP Cloud Run
- Supabase: Already hosted

## API Endpoints
### POST /upload
- Uploads clothing image and metadata
- Returns: outfit ID and storage URL

### POST /generate-combinations
- Input: outfit ID, user preferences
- Returns: Array of combination suggestions from Gemini

### POST /visualize
- Input: garment image URLs, target body parameters
- Returns: Visualized image URLs

### POST /favorites/toggle
- Input: combination ID
- Action: Toggle favorite status for user
- Returns: favorited boolean

### GET /favorites
- Input: user ID (from auth)
- Returns: List of favorited combinations with metadata and visualization URLs

## Reducing AI Usage Strategies
1. Manual type inputs reduce Gemini prompt complexity
2. Cache Gemini responses for similar inputs in Supabase DB
3. Rule-based fallback: If Gemini unavailable, use predefined combination rules
4. Batch processing: Process multiple items in single Gemini call when possible
5. Rate limiting: Track API calls per user/minute
6. Favorites feature: Save combinations to avoid regenerating

## Future Enhancements
- User body measurements for better IDM Veton fitting
- Seasonal outfit suggestions
- Social sharing of outfits
- Integration with clothing retailers for purchase links
- Outfit recommendation based on favorites and weather