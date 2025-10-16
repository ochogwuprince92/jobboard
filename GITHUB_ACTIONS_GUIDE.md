# 🚀 GitHub Actions CI/CD Guide

## ✅ What's Been Set Up

### GitHub Actions Workflows Created

1. **backend-ci.yml** - Backend continuous integration
2. **frontend-ci.yml** - Frontend continuous integration  
3. **full-ci.yml** - Complete CI/CD pipeline
4. **deploy.yml** - Deployment automation

---

## 📋 Workflows Overview

### 1. Backend CI (`backend-ci.yml`)

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when backend files change

**What it does**:
- ✅ Sets up Python 3.11
- ✅ Installs dependencies
- ✅ Runs linting (flake8)
- ✅ Runs database migrations
- ✅ Runs tests
- ✅ Checks for security issues

**Services**:
- PostgreSQL 15
- Redis 7

---

### 2. Frontend CI (`frontend-ci.yml`)

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Only when frontend files change

**What it does**:
- ✅ Sets up Node.js 20
- ✅ Installs dependencies
- ✅ Runs ESLint
- ✅ Runs TypeScript type checking
- ✅ Builds the application
- ✅ Uploads build artifacts

---

### 3. Full CI/CD (`full-ci.yml`)

**Triggers**:
- Push to `main` branch
- Pull requests to `main`

**What it does**:
- ✅ Runs backend tests
- ✅ Builds frontend
- ✅ Runs CodeQL security analysis
- ✅ Uploads artifacts

---

### 4. Deployment (`deploy.yml`)

**Triggers**:
- Push to `main` branch
- Version tags (v*)
- Manual workflow dispatch

**What it does**:
- ✅ Deploys backend (configure your service)
- ✅ Deploys frontend (configure your service)
- ✅ Creates GitHub releases for tags

---

## 🚀 How to Push to GitHub

### Step 1: Initialize Git (if not already done)

```bash
cd /home/ochogwuprince/jobboard
git init
```

### Step 2: Add all files

```bash
git add .
```

### Step 3: Create initial commit

```bash
git commit -m "Initial commit: AI-powered job board with CI/CD"
```

### Step 4: Create GitHub repository

1. Go to https://github.com/new
2. Repository name: `jobboard` (or your preferred name)
3. Description: "AI-powered job board with Django and Next.js"
4. Choose Public or Private
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Step 5: Add remote and push

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/jobboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔐 Required GitHub Secrets

For deployment workflows, add these secrets in GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

### For Heroku Deployment:
```
HEROKU_API_KEY=your-heroku-api-key
HEROKU_APP_NAME=your-app-name
HEROKU_EMAIL=your-email@example.com
```

### For Vercel Deployment:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### For Custom Deployment:
```
API_URL=https://your-api-url.com/api
SSH_PRIVATE_KEY=your-ssh-key (if using SSH)
SERVER_HOST=your-server-ip
SERVER_USER=your-username
```

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![Backend CI](https://github.com/YOUR_USERNAME/jobboard/workflows/Backend%20CI/badge.svg)
![Frontend CI](https://github.com/YOUR_USERNAME/jobboard/workflows/Frontend%20CI/badge.svg)
![Full CI/CD](https://github.com/YOUR_USERNAME/jobboard/workflows/Full%20CI/CD%20Pipeline/badge.svg)
```

---

## 🎯 How Workflows Work

### On Every Push to Main/Develop:

1. **Backend CI runs**:
   - Spins up PostgreSQL and Redis
   - Installs Python dependencies
   - Runs linting
   - Runs migrations
   - Runs tests
   - Checks security

2. **Frontend CI runs**:
   - Installs Node.js dependencies
   - Runs linting
   - Type checks TypeScript
   - Builds the app

3. **If all pass**: ✅ Green checkmark
4. **If any fail**: ❌ Red X with error details

### On Push to Main (Production):

1. All CI checks run
2. If successful, deployment workflow triggers
3. Backend deploys to your server
4. Frontend deploys to Vercel/Netlify
5. GitHub release created (if tagged)

---

## 🔧 Customizing Workflows

### To Change Python Version:

```yaml
# In backend-ci.yml
- name: Set up Python
  uses: actions/setup-python@v4
  with:
    python-version: '3.12'  # Change here
```

### To Change Node Version:

```yaml
# In frontend-ci.yml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '21'  # Change here
```

### To Add More Tests:

```yaml
# In backend-ci.yml, add after tests:
- name: Run coverage
  run: |
    pip install coverage
    coverage run --source='.' manage.py test
    coverage report
```

---

## 📝 Git Workflow Best Practices

### Branch Strategy:

```bash
main        # Production-ready code
develop     # Development branch
feature/*   # Feature branches
hotfix/*    # Urgent fixes
```

### Creating a Feature Branch:

```bash
# Create and switch to feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# CI will run automatically
```

### Merging to Main:

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Merge feature branch
git merge feature/new-feature

# Push to GitHub
git push origin main

# Deployment workflow runs automatically
```

---

## 🐛 Troubleshooting

### Workflow Fails on Tests:

1. Check the Actions tab on GitHub
2. Click on the failed workflow
3. Expand the failed step
4. Fix the issue locally
5. Push again

### Workflow Doesn't Trigger:

- Check if files changed match the `paths` filter
- Ensure you pushed to the correct branch
- Check if workflows are enabled in Settings

### Deployment Fails:

- Verify secrets are set correctly
- Check deployment service credentials
- Review deployment logs

---

## 📦 What Gets Deployed

### Backend:
- Django application
- Database migrations
- Static files
- Celery workers (if configured)

### Frontend:
- Next.js build
- Static assets
- Environment variables
- API connections

---

## 🎨 Workflow Visualization

```
Push to GitHub
      ↓
  Trigger CI
      ↓
┌─────────────┬─────────────┐
│  Backend CI │ Frontend CI │
├─────────────┼─────────────┤
│ - Lint      │ - Lint      │
│ - Test      │ - Type Check│
│ - Security  │ - Build     │
└─────────────┴─────────────┘
      ↓
   All Pass?
      ↓
   Deploy
      ↓
┌─────────────┬─────────────┐
│   Backend   │  Frontend   │
│   Server    │   Vercel    │
└─────────────┴─────────────┘
      ↓
  ✅ Live!
```

---

## 📚 Additional Resources

### GitHub Actions Documentation:
- https://docs.github.com/en/actions

### Deployment Guides:
- **Heroku**: https://devcenter.heroku.com/articles/github-integration
- **Vercel**: https://vercel.com/docs/git
- **Netlify**: https://docs.netlify.com/configure-builds/get-started/
- **DigitalOcean**: https://docs.digitalocean.com/products/app-platform/

---

## ✅ Quick Start Checklist

- [ ] Initialize Git repository
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify workflows run successfully
- [ ] Add deployment secrets (if deploying)
- [ ] Configure deployment service
- [ ] Add status badges to README
- [ ] Set up branch protection rules
- [ ] Configure notifications

---

## 🎯 Next Steps

1. **Push to GitHub** (see commands above)
2. **Watch workflows run** in Actions tab
3. **Fix any issues** that arise
4. **Configure deployment** when ready
5. **Set up branch protection** for main branch
6. **Add collaborators** if team project

---

## 📞 Support

If workflows fail:
1. Check the Actions tab for detailed logs
2. Review error messages
3. Fix issues locally
4. Push again

---

**Status**: ✅ GitHub Actions configured and ready!  
**Next**: Push to GitHub and watch automation magic! 🚀
