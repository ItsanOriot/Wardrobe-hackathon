# 🚀 Quick Deploy Guide - StyleIt

Deploy your StyleIt app in **30 minutes** or less!

---

## Prerequisites (5 minutes)

Before you start, make sure you have:

- [ ] GitHub account (with this repo pushed)
- [ ] Supabase account with project created
- [ ] OpenAI API key
- [ ] Render.com account (free)
- [ ] Vercel account (free)

---

## Step 1: Supabase Setup (5 minutes)

1. **Create Database Tables**
   - Go to your Supabase project → SQL Editor
   - Copy and paste contents of `backend/supabase_setup.sql`
   - Click "Run"

2. **Create Storage Bucket**
   - Go to Storage → "Create bucket"
   - Name: `wardrobe-images`
   - Set to **Public**

3. **Copy Your Keys**
   - Go to Settings → API
   - Copy `Project URL` (starts with https://)
   - Copy `anon public` key
   - Copy `service_role` key (keep this secret!)

---

## Step 2: Deploy Backend to Render (10 minutes)

1. **Go to Render.com**
   - Sign in at https://render.com
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select this repository

3. **Configure Service**
   ```
   Name: styleit-backend
   Region: (choose closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_SERVICE_KEY = your_service_role_key
   OPENAI_API_KEY = sk-your_openai_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., `https://styleit-backend.onrender.com`)

6. **Test Backend**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should see: `{"status": "healthy"}`

---

## Step 3: Deploy Frontend to Vercel (10 minutes)

1. **Go to Vercel**
   - Sign in at https://vercel.com
   - Click "Add New..." → "Project"

2. **Import Repository**
   - Select this repository
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (default)
   Output Directory: .next (default)
   Install Command: npm install (default)
   ```

4. **Add Environment Variables**
   Click "Environment Variables":
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_public_key
   NEXT_PUBLIC_API_URL = https://your-backend-url.onrender.com
   ```
   ⚠️ Use your Render backend URL from Step 2!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes
   - Copy your frontend URL (e.g., `https://styleit.vercel.app`)

---

## Step 4: Update Backend CORS (2 minutes)

1. **Go Back to Render**
   - Dashboard → Your Service → Environment

2. **Add Frontend URL**
   - Click "Add Environment Variable"
   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```
   ⚠️ Use your Vercel URL from Step 3!

3. **Save**
   - Click "Save Changes"
   - Render will auto-redeploy (takes 2-3 minutes)

---

## Step 5: Test Your App (3 minutes)

1. **Visit Your App**
   - Go to your Vercel URL
   - Open browser DevTools (F12) → Console

2. **Test Features**
   - [ ] Create an account
   - [ ] Log in
   - [ ] Upload a clothing item (click camera icon)
   - [ ] Check if image appears
   - [ ] Go to Wardrobe page
   - [ ] Test AI chat
   - [ ] Check for errors in console

3. **Verify**
   - No CORS errors in console
   - Images load correctly
   - AI chat responds
   - All features work

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/docs`

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel matches your Render URL
- Verify backend is running: visit `/health` endpoint
- Check browser console for CORS errors

### CORS errors
- Verify `FRONTEND_URL` is set in Render
- Make sure it matches your Vercel URL exactly
- Wait for Render to finish redeploying

### Images not loading
- Check Supabase storage bucket is public
- Verify bucket name is `wardrobe-images`
- Check browser console for image errors

### Backend errors
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Check OpenAI API key is valid

---

## 💡 Next Steps

### Optional Improvements
- [ ] Add custom domain (Vercel + Render)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable Vercel Analytics
- [ ] Upgrade Render to paid tier (no sleep)
- [ ] Set up automated backups

### Updating Your App
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Vercel auto-deploys frontend
5. Render auto-deploys backend
6. Test production site

---

## 📚 More Help

- **Detailed Guide**: See `DEPLOYMENT.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Summary**: See `DEPLOYMENT_SUMMARY.md`
- **Backend Docs**: See `backend/README.md`

---

## 💰 Costs

**Free Tier** (what you just deployed):
- Vercel: $0/month
- Render: $0/month (sleeps after 15min inactivity)
- Supabase: $0/month (500MB database, 1GB storage)
- OpenAI: ~$0.01-0.03 per chat

**Total: ~$0-5/month** depending on usage

---

## ⚠️ Important Notes

1. **Render Free Tier**: Backend sleeps after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - Upgrade to $7/month to prevent sleeping

2. **Supabase Free Tier**: Limited to 500MB database
   - Monitor usage in Supabase dashboard
   - Upgrade to Pro ($25/month) if needed

3. **OpenAI Costs**: Pay per API call
   - Monitor usage at https://platform.openai.com/usage
   - Set spending limits to avoid surprises

---

## 🎊 Congratulations!

You've successfully deployed a full-stack AI application!

Share your app with friends and start building your digital wardrobe! 👔👗👠

---

**Need help?** Check the troubleshooting section above or review the detailed guides.

