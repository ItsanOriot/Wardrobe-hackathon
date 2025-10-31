# Quick Start Guide - AI Stylist Application

## Prerequisites ✅

All dependencies are installed and verified. You just need to configure environment variables.

---

## Step 1: Configure Environment Variables

### Backend Configuration

Create `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=sk-your-openai-key
```

**Where to get these:**
1. **SUPABASE_URL** & **SUPABASE_SERVICE_KEY**
   - Go to https://supabase.com
   - Create a new project
   - Settings → API → Copy Project URL and service_role key

2. **OPENAI_API_KEY**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy and save securely

### Frontend Configuration

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Where to get these:**
- **NEXT_PUBLIC_SUPABASE_URL**: Same as backend
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Settings → API → Copy `anon` `public` key
- **NEXT_PUBLIC_API_URL**: Backend URL (default: http://localhost:8000)

---

## Step 2: Setup Supabase Database

1. Go to your Supabase project dashboard
2. SQL Editor → New Query
3. Copy entire contents of `backend/supabase_setup.sql`
4. Paste and click "Run"
5. Wait for completion

### Create Storage Bucket

1. Storage → Create new bucket
2. Name: `wardrobe-images`
3. Set "Public bucket" to ON
4. Click "Create bucket"

### Add Storage Policy

1. Click on `wardrobe-images` bucket
2. Policies tab → New policy → For full customization
3. Policy name: `Users can upload their own images`
4. Target roles: `authenticated`
5. Policy definition (SELECT, INSERT, UPDATE, DELETE):
```sql
(bucket_id = 'wardrobe-images' AND (storage.foldername(name))[1] = auth.uid()::text)
```
6. Click "Review" → "Save policy"

---

## Step 3: Run the Application

### Terminal 1 - Backend

```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
```

---

## Step 4: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign up" and create a test account
3. You should be redirected to the chat interface

### Test Features

**Image Scanning:**
- Click camera icon (top right)
- Upload a clothing photo
- Wait for AI analysis (5-10 seconds)
- Review extracted details
- Click "Add to Wardrobe"

**Chat:**
- Type: "What should I wear to a casual dinner?"
- AI should respond with styling advice

**Wardrobe:**
- Click menu icon (top left)
- Click "Wardrobe"
- View your clothing items in a grid

---

## Troubleshooting

### Backend won't start
```bash
# Make sure venv is activated
.\venv\Scripts\Activate.ps1

# Check dependencies
pip list

# Verify .env file exists and has all 3 variables
cat .env
```

### Frontend shows "Invalid token"
- Double-check Supabase URL and keys in `.env.local`
- Make sure you're using the `anon` key (not service_role)
- Try signing out and back in

### Image upload fails
- Verify bucket is named exactly `wardrobe-images`
- Make sure bucket is set to Public
- Check storage policy was created correctly

### AI responses don't work
- Verify OpenAI API key is correct
- Check you have credits in your OpenAI account
- Look at backend terminal for error messages

### Database errors
- Make sure you ran the full SQL setup script
- Check Supabase dashboard → Table Editor for `wardrobe_items` table
- Verify Row Level Security policies were created

---

## Useful Commands

### Backend
```bash
# Activate virtual environment
cd backend
.\venv\Scripts\Activate.ps1

# Install new package
pip install package-name

# List all packages
pip list

# Run tests (if available)
pytest

# Deactivate venv
deactivate
```

### Frontend
```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Install new package
npm install package-name
```

---

## API Documentation

Once backend is running, visit:
- **API Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

---

## Project Structure

```
wardrobe-hackathon/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py      # FastAPI app
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic
│   │   └── models/      # Data schemas
│   ├── requirements.txt  # Python dependencies
│   ├── supabase_setup.sql
│   └── venv/            # Virtual environment
│
├── frontend/            # Next.js frontend
│   ├── app/            # Pages
│   ├── components/     # React components
│   ├── lib/            # Utilities
│   ├── package.json    # npm dependencies
│   └── node_modules/   # Installed packages
│
├── CODEBASE_INDEX.md
├── INSTALLATION_REPORT.md
└── QUICK_START.md      # This file
```

---

## Next Steps

1. ✅ Install dependencies (DONE)
2. ⏳ Configure environment variables
3. ⏳ Setup Supabase database
4. ⏳ Run backend and frontend
5. ⏳ Test the application
6. ⏳ Customize AI prompts (optional)
7. ⏳ Deploy to production (optional)

---

## Support

For detailed information, see:
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `CODEBASE_INDEX.md` - Code structure and components
- `INSTALLATION_REPORT.md` - Installation details and troubleshooting

Enjoy your AI Stylist! 🎨👔

