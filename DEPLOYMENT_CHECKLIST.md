# StyleIt Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### 1. Supabase Setup
- [ ] Supabase project created
- [ ] Database tables created (run `backend/supabase_setup.sql`)
- [ ] Storage bucket `wardrobe-images` created
- [ ] Storage bucket set to public (or RLS configured)
- [ ] Copied Supabase URL
- [ ] Copied Supabase Anon Key
- [ ] Copied Supabase Service Role Key

### 2. OpenAI Setup
- [ ] OpenAI account created
- [ ] API key generated
- [ ] Account has credits/billing enabled
- [ ] Confirmed access to GPT-4o models

### 3. Code Preparation
- [ ] All changes committed to Git
- [ ] Pushed to GitHub repository
- [ ] `.env` files NOT committed (in `.gitignore`)
- [ ] Tested locally with `npm run dev` (frontend)
- [ ] Tested locally with `python run_server.py` (backend)

---

## Backend Deployment (Render)

### 1. Create Render Account
- [ ] Signed up at https://render.com
- [ ] Connected GitHub account

### 2. Create Web Service
- [ ] Clicked "New +" → "Web Service"
- [ ] Selected repository
- [ ] Configured settings:
  - Name: `styleit-backend`
  - Region: (closest to users)
  - Branch: `main`
  - Root Directory: `backend`
  - Runtime: `Python 3`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3. Environment Variables
- [ ] Added `SUPABASE_URL`
- [ ] Added `SUPABASE_SERVICE_KEY`
- [ ] Added `OPENAI_API_KEY`
- [ ] Added `FRONTEND_URL` (will update after frontend deployment)

### 4. Deploy & Test
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment (5-10 min)
- [ ] Copied backend URL (e.g., `https://styleit-backend.onrender.com`)
- [ ] Tested health endpoint: `https://your-backend.onrender.com/health`
- [ ] Verified response: `{"status": "healthy"}`
- [ ] Tested API docs: `https://your-backend.onrender.com/docs`

---

## Frontend Deployment (Vercel)

### 1. Create Vercel Account
- [ ] Signed up at https://vercel.com
- [ ] Connected GitHub account

### 2. Import Project
- [ ] Clicked "Add New..." → "Project"
- [ ] Selected repository
- [ ] Configured settings:
  - Framework Preset: Next.js
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

### 3. Environment Variables
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `NEXT_PUBLIC_API_URL` (your Render backend URL)

### 4. Deploy & Test
- [ ] Clicked "Deploy"
- [ ] Waited for deployment (2-5 min)
- [ ] Copied frontend URL (e.g., `https://styleit.vercel.app`)
- [ ] Visited the URL
- [ ] Tested signup/login
- [ ] Tested uploading an item
- [ ] Tested AI chat

---

## Post-Deployment Configuration

### 1. Update Backend CORS
- [ ] Went to Render dashboard → Environment Variables
- [ ] Updated `FRONTEND_URL` to your Vercel URL
- [ ] Saved changes (triggers auto-redeploy)
- [ ] Waited for redeploy to complete

### 2. Verify Integration
- [ ] Opened frontend in browser
- [ ] Opened browser DevTools (F12) → Console
- [ ] Checked for CORS errors (should be none)
- [ ] Tested all features:
  - [ ] Signup
  - [ ] Login
  - [ ] Upload clothing item
  - [ ] Edit item
  - [ ] Delete item
  - [ ] AI chat
  - [ ] Image references in chat

### 3. Performance Check
- [ ] Tested page load speed
- [ ] Tested API response times
- [ ] Checked for console errors
- [ ] Tested on mobile device

---

## Optional Enhancements

### Custom Domain
- [ ] Purchased domain
- [ ] Added to Vercel (Project Settings → Domains)
- [ ] Updated DNS records
- [ ] Added to Render (Service Settings → Custom Domain)
- [ ] Updated `FRONTEND_URL` in Render

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Enabled Vercel Analytics
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### Security
- [ ] Reviewed Supabase RLS policies
- [ ] Enabled 2FA on all accounts
- [ ] Reviewed API rate limits
- [ ] Set up backup strategy

---

## Troubleshooting

### Frontend can't connect to backend
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Verify backend is running: visit `/health` endpoint
3. Check browser console for CORS errors
4. Verify `FRONTEND_URL` is set correctly in Render

### Authentication errors
1. Check Supabase keys are correct
2. Verify Supabase project is active
3. Check RLS policies in Supabase
4. Test with Supabase dashboard

### Images not loading
1. Verify Supabase storage bucket exists
2. Check bucket is public or has correct RLS
3. Verify `next.config.ts` has Supabase domain
4. Check image URLs in database

### Backend errors
1. Check Render logs (Dashboard → Logs)
2. Verify all environment variables are set
3. Check OpenAI API key is valid
4. Verify Supabase service key is correct

### Slow performance
1. Check Render instance type (upgrade from free tier)
2. Enable Vercel Edge Functions if needed
3. Optimize images in Supabase
4. Add caching headers

---

## Deployment Complete! 🎉

Your StyleIt application is now live!

**Frontend URL**: `https://your-app.vercel.app`  
**Backend URL**: `https://your-backend.onrender.com`  
**API Docs**: `https://your-backend.onrender.com/docs`

### Next Steps
1. Share with users
2. Monitor logs and errors
3. Gather feedback
4. Plan new features
5. Set up CI/CD for automated testing

---

## Maintenance

### Regular Tasks
- [ ] Monitor Render logs weekly
- [ ] Check Vercel deployment logs
- [ ] Review Supabase usage
- [ ] Monitor OpenAI API costs
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### When Updating Code
1. Test locally first
2. Commit and push to GitHub
3. Vercel auto-deploys frontend
4. Render auto-deploys backend
5. Monitor deployment logs
6. Test production site
7. Rollback if issues occur

---

For detailed instructions, see `DEPLOYMENT.md`

