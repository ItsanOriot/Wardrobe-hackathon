# Deployment Guide for StyleIt

This guide covers deploying the StyleIt application using Vercel for the frontend and a separate platform for the backend.

## Architecture

- **Frontend**: Next.js app deployed on Vercel
- **Backend**: FastAPI app deployed on Render/Railway/Fly.io (recommended: Render)

## Prerequisites

1. GitHub account
2. Vercel account (https://vercel.com)
3. Render account (https://render.com) or alternative backend hosting
4. Supabase project with:
   - Database tables created (see `backend/supabase_setup.sql`)
   - Storage bucket named `wardrobe-images` with public access
   - Service role key and anon key
5. OpenAI API key

---

## Part 1: Deploy Backend (Render.com)

### Step 1: Prepare Backend Repository
The backend is already configured in the `/backend` directory.

### Step 2: Create Render Web Service

1. Go to https://render.com and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `styleit-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for better performance)

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
OPENAI_API_KEY=sk-your_openai_key_here
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://styleit-backend.onrender.com`)

### Step 5: Update CORS

After getting your Vercel frontend URL (next section), update `backend/app/main.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app"  # For preview deployments
]
```

Then commit and push to trigger a redeploy on Render.

---

## Part 2: Deploy Frontend (Vercel)

### Step 1: Update Next.js Configuration

The `next.config.ts` has been updated to include Supabase storage domain.
Update the domain in the file with your actual Supabase project URL.

### Step 2: Create Vercel Project

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=https://styleit-backend.onrender.com
```

**Important**: Replace the `NEXT_PUBLIC_API_URL` with your actual Render backend URL from Part 1.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-5 minutes)
3. Copy your frontend URL (e.g., `https://styleit.vercel.app`)

### Step 5: Update Backend CORS

Go back to your `backend/app/main.py` and update the CORS origins with your Vercel URL (see Part 1, Step 5).

---

## Part 3: Configure Supabase

### Step 1: Update Supabase Storage

1. Go to your Supabase project → Storage
2. Ensure `wardrobe-images` bucket exists
3. Set bucket to **public** (or configure RLS policies)
4. Note your storage URL: `https://your-project.supabase.co/storage/v1/object/public/wardrobe-images/`

### Step 2: Update Next.js Config

Update `frontend/next.config.ts` with your Supabase domain:

```typescript
domains: ['your-project.supabase.co']
```

Commit and push to trigger a Vercel redeploy.

### Step 3: Verify Database Tables

Ensure all tables are created using `backend/supabase_setup.sql`:
- `users`
- `wardrobe_items`
- `chat_messages`
- `chat_image_references`

---

## Part 4: Testing Deployment

### Test Backend
Visit: `https://your-backend-url.onrender.com/health`

Should return: `{"status": "healthy"}`

### Test Frontend
Visit: `https://your-app.vercel.app`

1. Create an account
2. Log in
3. Upload a clothing item
4. Test the AI chat feature

---

## Alternative Backend Hosting Options

### Railway.app
- Similar to Render
- Root Directory: `backend`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add same environment variables

### Fly.io
Requires `Dockerfile` in backend directory:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Deploy: `fly launch` from backend directory

### Google Cloud Run
1. Create `Dockerfile` (same as above)
2. Build: `gcloud builds submit --tag gcr.io/PROJECT-ID/styleit-backend`
3. Deploy: `gcloud run deploy --image gcr.io/PROJECT-ID/styleit-backend --platform managed`

---

## Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Backend (Render/Railway/etc.)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
OPENAI_API_KEY=sk-...
```

---

## Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend CORS includes your Vercel URL
- Check backend is running: visit `/health` endpoint

### Images not loading
- Verify Supabase storage bucket is public
- Check `next.config.ts` has correct domain
- Verify image URLs in database are correct

### Authentication errors
- Check Supabase keys are correct
- Verify RLS policies allow access
- Check JWT token expiration settings

### Backend errors
- Check environment variables are set
- View logs in Render/Railway dashboard
- Verify all dependencies in `requirements.txt`

---

## Updating the Application

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Preview deployments for PRs

### Backend Updates
1. Push changes to GitHub
2. Render/Railway auto-deploys from `main` branch
3. Monitor deployment logs

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Monitoring & Logs

### Vercel
- Dashboard → Your Project → Deployments
- Real-time logs during build
- Runtime logs in Functions tab

### Render
- Dashboard → Your Service → Logs
- Real-time streaming logs
- Metrics and performance data

---

## Cost Estimates

### Free Tier (Hobby Projects)
- **Vercel**: Free (Hobby plan)
- **Render**: Free (with limitations: sleeps after 15min inactivity)
- **Supabase**: Free (500MB database, 1GB storage)
- **OpenAI**: Pay-per-use (GPT-4o: ~$0.01-0.03 per request)

### Paid Tier (Production)
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month (no sleep)
- **Supabase Pro**: $25/month
- **OpenAI**: Based on usage

---

## Security Checklist

- [ ] All environment variables set correctly
- [ ] Supabase RLS policies configured
- [ ] CORS configured with specific domains (not `*`)
- [ ] API keys stored as environment variables (not in code)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Supabase storage bucket permissions configured
- [ ] Rate limiting considered for API endpoints

---

## Next Steps

1. Set up monitoring (Sentry, LogRocket, etc.)
2. Configure custom domain
3. Set up CI/CD for automated testing
4. Add analytics (Vercel Analytics, Google Analytics)
5. Configure backup strategy for Supabase
6. Set up error tracking and alerting

---

For questions or issues, refer to:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Supabase Docs: https://supabase.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- Next.js Docs: https://nextjs.org/docs

