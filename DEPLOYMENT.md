# 🚀 Free Deployment Guide - Render + Neon PostgreSQL

Deploy your **Luu Sac** student POC project with **$0/month** cost using Render's free tier and Neon's free PostgreSQL database.

## 💰 Cost Breakdown

- **Render API Service**: Free (spins down after 15 min inactivity)
- **Render Web Service**: Free (spins down after 15 min inactivity)
- **Neon PostgreSQL**: Free (500MB storage, 3GB transfer/month)
- **Total Monthly Cost**: **$0** 🎉

## 📋 Prerequisites

1. **GitHub Account** - Repository must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **Neon Account** - Sign up at [neon.tech](https://neon.tech) (free)
4. **Cloudinary Account** - Sign up at [cloudinary.com](https://cloudinary.com) (free tier)

---

## 🗄️ Part 1: Setup Neon PostgreSQL Database

### Step 1: Create Neon Account & Database

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** → Use GitHub or email
3. Create new project:
   - **Project Name**: `luu-sac-db`
   - **Region**: Choose closest to Oregon (for Render compatibility)
   - **PostgreSQL Version**: Latest (16.x)
4. Click **"Create Project"**

### Step 2: Get Database Connection String

1. In your Neon dashboard, go to **"Connection Details"**
2. Select **"Pooled connection"** (recommended for serverless)
3. Copy the connection string - it looks like:
   ```
   postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. **Save this** - you'll need it for Render configuration

### Step 3: Configure Database

1. Go to **"Branches"** → Select `main` branch
2. Note your limits (free tier):
   - **Storage**: 500MB
   - **Data Transfer**: 3GB/month
   - **Active time**: Always on
3. Database is ready! ✅

---

## 🌐 Part 2: Deploy to Render

### Option A: Blueprint Method (Recommended - Faster)

#### Step 1: Push Code to GitHub

```bash
# If not already on GitHub
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

#### Step 2: Create Blueprint on Render

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not connected
4. Select repository: `your-username/luu-sac`
5. Render will detect `render.yaml`
6. Click **"Apply"**

#### Step 3: Configure Environment Variables

**For API Service** (luu-sac-api):

Click on the API service → **"Environment"** tab:

```bash
# Database
DATABASE_URL=<paste your Neon connection string>

# JWT Secret (generate: openssl rand -base64 32)
JWT_SECRET=<generate a random string>

# CORS (we'll update this after web deployment)
CORS_ORIGIN=<leave blank for now>

# Cloudinary (from cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=<your cloudinary name>
CLOUDINARY_API_KEY=<your cloudinary key>
CLOUDINARY_API_SECRET=<your cloudinary secret>
```

**For Web Service** (luu-sac-web):

Click on the Web service → **"Environment"** tab:

```bash
# API URL (we'll update this after API deployment)
NEXT_PUBLIC_API_URL=<leave blank for now>
```

#### Step 4: Get Service URLs

1. **API Service**:
   - Go to API service
   - Copy URL (e.g., `https://luu-sac-api.onrender.com`)
2. **Web Service**:
   - Go to Web service
   - Copy URL (e.g., `https://luu-sac-web.onrender.com`)

#### Step 5: Update Environment Variables

**Update API Service**:

- Set `CORS_ORIGIN` to your Web service URL
- Save → Service will redeploy

**Update Web Service**:

- Set `NEXT_PUBLIC_API_URL` to your API service URL
- Save → Service will redeploy

---

### Option B: Manual Service Creation

<details>
<summary>Click to expand manual method</summary>

#### Create API Service

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Configure:
   - **Name**: `luu-sac-api`
   - **Region**: Oregon (free)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: Node
   - **Build Command**: `bash scripts/build-api.sh`
   - **Start Command**: `cd apps/api && npm start`
   - **Plan**: Free

5. Add environment variables (see Option A Step 3)
6. Click **"Create Web Service"**

#### Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select same repository
3. Configure:
   - **Name**: `luu-sac-web`
   - **Region**: Oregon (free)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: Node
   - **Build Command**: `bash scripts/build-web.sh`
   - **Start Command**: `cd apps/web && npm start`
   - **Plan**: Free

4. Add environment variables (see Option A Step 3)
5. Click **"Create Web Service"**

#### Update Cross-References

Follow Option A Step 4-5 to link services.

</details>

---

## 📊 Part 3: Monitor Deployment

### Watch Build Logs

1. Go to each service
2. Click **"Logs"** tab
3. Watch for:
   - ✅ `Installing dependencies...`
   - ✅ `Building shared package...`
   - ✅ `Build complete!`
   - ✅ `Server is running...`

### First Deploy (Cold Start)

- **API**: ~10-15 minutes (includes migration)
- **Web**: ~5-10 minutes

Look for these in **API logs**:

```
🚀 Running database migrations...
✅ Database is now in sync
Server is running on http://0.0.0.0:10000
```

---

## ✅ Part 4: Verification

### 1. Test API Health

Open in browser:

```
https://your-api.onrender.com/
```

**Expected Response**:

```
"Luu Sac API is running"
```

### 2. Test Web Application

Open in browser:

```
https://your-web.onrender.com
```

**Expected**: Homepage loads successfully

### 3. Check Browser Console

Press `F12` → Console tab

**Should see**: No CORS errors, API calls successful

### 4. Full Integration Test

- [ ] Register new user account
- [ ] Login with credentials
- [ ] View products page
- [ ] Test image display
- [ ] Try AR viewer (if applicable)
- [ ] Test admin panel (if admin user)

### 5. Database Verification

**In Neon Dashboard**:

1. Go to **"Tables"** tab
2. You should see: `User`, `Product`, `Category`, `Order`, etc.
3. Check **"Usage"** → Storage should be < 500MB

---

## 🐛 Troubleshooting

### API Won't Start

**Symptoms**: Service shows "Deploy failed" or keeps crashing

**Check**:

- [ ] `DATABASE_URL` is correctly set (copy-paste from Neon)
- [ ] Build logs show successful TypeScript compilation
- [ ] Migrations completed without errors

**Fix**:

```bash
# In Render, go to API service → "Shell" tab
cd apps/api
npx prisma migrate deploy
```

### Web Can't Connect to API

**Symptoms**: Products won't load, CORS errors in console

**Check**:

- [ ] `NEXT_PUBLIC_API_URL` matches API service URL exactly
- [ ] API `CORS_ORIGIN` matches Web service URL exactly
- [ ] Both services show "Live" status

**Fix**: Update environment variables → Save → Redeploy

### Database Connection Errors

**Symptoms**: API logs show "Can't reach database"

**Check**:

- [ ] Neon database is active (check neon.tech dashboard)
- [ ] Connection string includes `?sslmode=require`
- [ ] Using **pooled connection** string from Neon

**Fix**: Copy connection string again from Neon, ensure it's the pooled version

### Services Keep Spinning Down

**This is normal for free tier!**

- Free services sleep after 15 minutes of inactivity
- First request takes ~30-60 seconds to wake up
- Subsequent requests are fast

**Workaround**: Use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your services every 14 minutes

### Build Fails on Render

**Check build logs for**:

- TypeScript errors → Fix in your code
- Missing dependencies → Check `package.json`
- Out of memory → Free tier has 512MB limit

**Common fixes**:

- Reduce build parallelization
- Clear build cache: Settings → "Clear build cache"

---

## 📈 Monitoring & Limits

### Render Free Tier Limits

- **750 hours/month** per service (more than enough)
- **512MB RAM** per service
- **Spin down** after 15 min inactivity
- **Unlimited** deploys

### Neon Free Tier Limits

- **500MB** storage
- **3GB** data transfer/month
- **1 project**, unlimited databases
- **Always on** (no sleep)

### Check Usage

**Render**:

- Dashboard → Service → "Metrics" tab
- Shows: CPU, memory, requests

**Neon**:

- Dashboard → Project → "Usage" tab
- Shows: Storage, data transfer, active time

---

## 🔄 Redeployment

### Automatic (Recommended)

1. Push code to GitHub: `git push`
2. Render auto-detects and redeploys
3. Watch logs for deployment progress

### Manual

1. Go to service in Render
2. Click **"Manual Deploy"** → **"Clear build cache & deploy"**
3. Wait for deployment

---

## 🎓 Tips for Student POC

### For Demos

1. **Wake up services** 5 minutes before demo:
   - Visit both URLs to wake them up
   - Or use uptime monitor

2. **Prepare demo account**:
   - Create test user ahead of time
   - Add sample products with images

3. **Show professional setup**:
   - "Deployed on Render with CI/CD"
   - "Using Neon's serverless PostgreSQL"
   - "Zero monthly cost with free tiers"

### Performance Tips

- **Images**: Compress before uploading (Cloudinary has limits)
- **Database**: Monitor storage usage in Neon
- **Uptime**: Use UptimeRobot to keep services warm

### URLs to Share

```
Frontend: https://luu-sac-web.onrender.com
API: https://luu-sac-api.onrender.com
API Health: https://luu-sac-api.onrender.com/
```

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment)
- [Render Discord](https://discord.gg/render) - Community support

---

## 🆘 Quick Reference

### Generate JWT Secret

```bash
openssl rand -base64 32
```

### Check Prisma Status

```bash
cd apps/api
npx prisma migrate status
```

### View Database

Use Neon's SQL Editor or:

```bash
npx prisma studio
```

### Environment Variables Summary

| Service | Variable              | Where to Get                       |
| ------- | --------------------- | ---------------------------------- |
| API     | `DATABASE_URL`        | Neon dashboard (pooled connection) |
| API     | `JWT_SECRET`          | Generate with openssl              |
| API     | `CORS_ORIGIN`         | Web service URL                    |
| API     | `CLOUDINARY_*`        | Cloudinary console                 |
| Web     | `NEXT_PUBLIC_API_URL` | API service URL                    |

---

## ✨ Success!

Your application is now deployed for **$0/month**!

**Next Steps**:

1. Test all functionality
2. Add sample data for demo
3. Set up uptime monitor (optional)
4. Share URLs with your team

Good luck with your student project! 🚀📱

**Need help?** Check the troubleshooting section or Render/Neon community forums.
