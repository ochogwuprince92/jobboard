#!/bin/bash

# 🚀 Push Job Board to GitHub
# This script helps you push your project to GitHub

echo "🚀 Job Board - GitHub Push Script"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured"
    git remote -v
else
    echo ""
    echo "⚠️  No remote configured yet"
    echo ""
    echo "Please create a GitHub repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository (e.g., 'jobboard')"
    echo "3. Don't initialize with README"
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/jobboard.git): " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    echo "🔗 Adding remote..."
    git remote add origin "$REPO_URL"
    echo "✅ Remote added"
fi

echo ""
echo "📝 Checking for changes..."

# Check if there are changes
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "ℹ️  No changes to commit"
else
    echo "📦 Adding all files..."
    git add .
    
    echo ""
    read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Update: AI-powered job board with professional UI and CI/CD"
    fi
    
    echo "💾 Committing changes..."
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed"
fi

echo ""
echo "🚀 Pushing to GitHub..."
echo ""

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

# Push to GitHub
if git push -u origin "$BRANCH"; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your project is now on GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Check the Actions tab to see CI/CD workflows"
    echo "3. Review the GITHUB_ACTIONS_GUIDE.md for more info"
    echo ""
else
    echo ""
    echo "❌ Push failed. This might be because:"
    echo "1. The repository doesn't exist on GitHub"
    echo "2. You don't have permission"
    echo "3. You need to authenticate"
    echo ""
    echo "Try running: git push -u origin $BRANCH"
    echo ""
fi
