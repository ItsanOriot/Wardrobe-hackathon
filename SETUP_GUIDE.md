# Quick Setup Guide

Follow these steps to get your AI Stylist application running.

## 1. Supabase Setup (5 minutes)

### Create Project
1. Go to https://supabase.com and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Note your project URL and API keys from Settings → API

### Run SQL Setup
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `backend/supabase_setup.sql`
3. Click "Run" to create the database schema

### Create Storage Bucket
1. Go to Storage → Create new bucket
2. Bucket name: `wardrobe-images`
3. Set "Public bucket" to ON
4. Click "Create bucket"

### Add Storage Policy
1. Click on the `wardrobe-images` bucket
2. Go to "Policies" tab
3. Click "New policy" → "For full customization"
4. Policy name: `Users can upload their own images`
5. Target roles: `authenticated`
6. Policy definition - SELECT, INSERT, UPDATE, DELETE:
```sql
(bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text)
```
7. Click "Review" → "Save policy"

## 2. Get API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and save it securely

### Supabase Keys (from your Supabase project)
1. Go to Settings → API
2. Copy:
   - Project URL
   - `anon` `public` key (for frontend)
   - `service_role` `secret` key (for backend)

## 3. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate
# OR Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # service_role key
OPENAI_API_KEY=sk-...
```

## 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # anon key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 5. Run the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
```

## 6. Test the Application

1. Open http://localhost:3000 in your browser
2. You should see the login page
3. Click "Sign up" and create a test account
4. You'll be redirected to the chat interface

### Test Image Scanning
1. Click the camera icon (top right)
2. Upload a photo of clothing
3. Wait for the AI to analyze it (5-10 seconds)
4. Review the extracted details
5. Click "Add to Wardrobe"

### Test Chat
1. Type a message like "What should I wear to a casual dinner?"
2. The AI should respond with styling advice
3. If you have items in your wardrobe, it will reference them by name

### Test Wardrobe
1. Click the menu icon (top left)
2. Click "Wardrobe"
3. You should see your clothing items in a grid
4. Click any item to edit its details

## Troubleshooting

### Backend won't start
- Make sure you activated the virtual environment
- Check that all dependencies installed: `pip list`
- Verify your `.env` file has all three variables

### Frontend shows "Invalid token"
- Double-check your Supabase URL and keys in `.env.local`
- Make sure you're using the `anon` key (not service_role)
- Try signing out and back in

### Image upload fails
- Verify the storage bucket is named exactly `wardrobe-images`
- Make sure the bucket is set to Public
- Check that the storage policy was created correctly

### AI responses don't work
- Verify your OpenAI API key is correct
- Check that you have credits in your OpenAI account
- Look at the backend terminal for error messages

### Database errors
- Make sure you ran the full SQL setup script
- Check the Supabase dashboard → Table Editor to see if `wardrobe_items` exists
- Verify Row Level Security policies were created

## Next Steps

Once everything is working:
1. Try uploading multiple clothing items
2. Test the filter features in the wardrobe
3. Ask the AI for outfit combinations
4. Customize the AI prompts in `backend/app/prompts.py`
5. Adjust the color scheme in `frontend/tailwind.config.ts`

## Production Deployment

For deploying to production:
- Frontend: Deploy to Vercel (automatic Next.js support)
- Backend: Deploy to Railway, Render, or AWS
- Update `NEXT_PUBLIC_API_URL` to your production backend URL
- Update CORS settings in `backend/app/main.py`

Enjoy your AI Stylist! 🎨👔
