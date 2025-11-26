# Deployment Guide - Vercel

This guide will help you deploy your WCL Expression Helper to Vercel.

## Prerequisites

1. A GitHub account (to connect with Vercel)
2. Git installed on your computer
3. A Vercel account (free - sign up at https://vercel.com)

## Step 1: Initialize Git Repository (if not already done)

```bash
cd /Users/kwaktaewon/Documents/WCL_queryMaker
git init
git add .
git commit -m "Initial commit - WCL Expression Helper"
```

## Step 2: Push to GitHub

1. Go to https://github.com and create a new repository (name it something like `wcl-expression-helper`)
2. **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Copy the repository URL (should look like: `https://github.com/YOUR_USERNAME/wcl-expression-helper.git`)
4. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/wcl-expression-helper.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended for first time)

1. Go to https://vercel.com and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

6. **Environment Variables** - Click "Add" and set:
   - `WCL_CLIENT_ID` = your WCL client ID
   - `WCL_CLIENT_SECRET` = your WCL client secret
   - `NODE_ENV` = production

7. Click **"Deploy"**

### Option B: Using Vercel CLI (Advanced)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - What's your project's name? wcl-expression-helper
# - In which directory is your code located? ./
# - Want to override the settings? No

# Add environment variables
vercel env add WCL_CLIENT_ID
vercel env add WCL_CLIENT_SECRET
vercel env add NODE_ENV

# Deploy to production
vercel --prod
```

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to **Settings** → **Domains**
3. Add your custom domain
4. Follow Vercel's instructions to:
   - Add DNS records (A record or CNAME)
   - Wait for DNS propagation (can take up to 48 hours)

## Step 5: Access Your Deployed App

After deployment, Vercel will give you a URL like:
- `https://wcl-expression-helper.vercel.app`
- Or your custom domain if you set one up

### Available Pages:
- `/` - API documentation
- `/expression-helper.html` - Expression Helper tool
- `/query-builder.html` - GraphQL Query Builder (legacy)
- `/timeline.html` - Timeline Visualizer (legacy)

## Automatic Deployments

Once set up, every time you push to your GitHub repository's main branch, Vercel will automatically:
1. Build your project
2. Run tests (if configured)
3. Deploy the new version
4. Keep the old version as a rollback option

## Updating Your Deployment

```bash
# Make your changes
git add .
git commit -m "Update: description of your changes"
git push origin main

# Vercel will automatically deploy the changes
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### Environment Variables Not Working
- Make sure they're set in Vercel dashboard under Settings → Environment Variables
- Redeploy after adding environment variables

### 404 Errors
- Check that files are in the `public` directory
- Verify `vercel.json` routing configuration
- Make sure build output includes the public files

### API Routes Not Working
- Check that your Express server is correctly exported
- Verify routes in `vercel.json`
- Check function logs in Vercel dashboard

## Monitoring

- View deployment logs: Vercel Dashboard → Your Project → Deployments
- View runtime logs: Vercel Dashboard → Your Project → Functions
- Analytics: Available in Vercel Pro plan

## Security Notes

- ✅ Environment variables are encrypted by Vercel
- ✅ HTTPS is automatic
- ✅ `.env` files are NOT deployed (in `.gitignore`)
- ⚠️ Never commit `.env` files to Git
- ⚠️ Keep your WCL credentials secure

## Cost

Vercel Free Tier includes:
- Unlimited deployments
- 100 GB bandwidth per month
- Automatic HTTPS
- Preview deployments for each Git branch

This is more than enough for this project!
