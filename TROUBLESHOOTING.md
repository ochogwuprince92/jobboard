# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## ✅ Fixed Issues

### 1. Hydration Mismatch Warning ✅ FIXED
**Error**: "A tree hydrated but some attributes didn't match"

**Cause**: Browser extensions (Grammarly, etc.) adding attributes to HTML

**Solution**: Added `suppressHydrationWarning` to body tag in `layout.tsx`

**Status**: ✅ Fixed - Warning will no longer appear

---

## 🐛 Common Issues

### Frontend Issues

#### Issue: "Module not found" errors
**Symptoms**: Build fails with import errors

**Solutions**:
```bash
# 1. Clear cache and rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run dev

# 2. Check if file exists
ls -la src/api/
ls -la src/components/

# 3. Verify imports use correct paths
# ✅ Correct: import { useAuth } from "@/context/AuthContext"
# ❌ Wrong: import { useAuth } from "@/hooks/useAuth"
```

#### Issue: "Cannot find module '@/api'"
**Cause**: Old import statement

**Solution**: Update import to specific file:
```typescript
// ❌ Wrong
import api from "@/api";

// ✅ Correct
import axiosClient from "@/api/axiosClient";
import { getJobs } from "@/api/jobs";
```

#### Issue: Frontend won't start
**Symptoms**: Port 3000 already in use

**Solutions**:
```bash
# Kill existing process
pkill -f "next dev"

# Or use different port
npm run dev -- -p 3001
```

#### Issue: "localStorage is not defined"
**Cause**: Accessing localStorage during SSR

**Solution**: Check if window exists:
```typescript
if (typeof window !== "undefined") {
  localStorage.getItem("access_token");
}
```

---

### Backend Issues

#### Issue: Backend won't start
**Symptoms**: Port 8000 already in use

**Solutions**:
```bash
# Kill existing process
pkill -f "python.*runserver"

# Or check what's using the port
lsof -i :8000

# Then restart
cd backend
source venv/bin/activate
python manage.py runserver
```

#### Issue: Database connection error
**Symptoms**: "could not connect to server"

**Solutions**:
```bash
# 1. Check if PostgreSQL is running
sudo systemctl status postgresql

# 2. Start PostgreSQL if stopped
sudo systemctl start postgresql

# 3. Check database exists
psql -U postgres -l

# 4. Create database if needed
psql -U postgres -c "CREATE DATABASE jobboard;"

# 5. Run migrations
python manage.py migrate
```

#### Issue: "No module named 'X'"
**Cause**: Missing Python package

**Solution**:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

#### Issue: Migration errors
**Solutions**:
```bash
# 1. Check migration status
python manage.py showmigrations

# 2. Fake initial migration if needed
python manage.py migrate --fake-initial

# 3. Reset migrations (⚠️ destroys data)
python manage.py migrate --fake app_name zero
python manage.py migrate app_name

# 4. Fresh start (⚠️ destroys ALL data)
python manage.py flush
python manage.py migrate
```

---

### API Issues

#### Issue: 401 Unauthorized
**Cause**: Token expired or missing

**Solutions**:
```bash
# 1. Check if token exists
# Open browser console
localStorage.getItem("access_token")

# 2. Login again to get new token

# 3. Check token expiration in settings.py
# ACCESS_TOKEN_LIFETIME_MINUTES = 60
```

#### Issue: CORS errors
**Symptoms**: "blocked by CORS policy"

**Solution**: Check `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### Issue: 404 Not Found on API
**Cause**: Wrong endpoint URL

**Solutions**:
```bash
# 1. Check Swagger docs
# http://localhost:8000/api/docs/

# 2. Verify endpoint exists
curl http://localhost:8000/api/jobs/

# 3. Check trailing slash
# ✅ Correct: /api/jobs/
# ❌ Wrong: /api/jobs
```

---

### Build Issues

#### Issue: TypeScript errors
**Solutions**:
```bash
# 1. Check for type errors
cd frontend
npm run build

# 2. Fix common issues:
# - Add missing types from @/types
# - Fix 'any' types
# - Add proper interfaces

# 3. Skip type checking (not recommended)
# In next.config.ts:
# typescript: { ignoreBuildErrors: true }
```

#### Issue: ESLint warnings
**Solutions**:
```bash
# 1. Fix automatically
npm run lint -- --fix

# 2. Disable specific rules in .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "off"
  }
}
```

---

## 🔍 Debugging Tips

### Frontend Debugging

1. **Check Browser Console**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **React DevTools**
   - Install React DevTools extension
   - Inspect component props and state

3. **Check Network Requests**
   - F12 → Network tab
   - Filter by XHR
   - Check request/response

### Backend Debugging

1. **Check Terminal Output**
   - Look for error messages
   - Check stack traces

2. **Use Django Shell**
   ```bash
   python manage.py shell
   >>> from users.models import User
   >>> User.objects.all()
   ```

3. **Check Logs**
   ```bash
   # Django logs in terminal
   # Or check log files if configured
   tail -f logs/django.log
   ```

---

## 🚨 Emergency Reset

### If Everything is Broken

**Frontend Reset**:
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

**Backend Reset**:
```bash
cd backend
source venv/bin/activate

# Reset database (⚠️ destroys data)
python manage.py flush --no-input

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Restart server
python manage.py runserver
```

**Full Reset** (⚠️ NUCLEAR OPTION):
```bash
# Stop all servers
pkill -f "python.*runserver"
pkill -f "next dev"

# Backend
cd backend
rm -rf __pycache__ */migrations/__pycache__
source venv/bin/activate
python manage.py flush
python manage.py migrate

# Frontend
cd ../frontend
rm -rf .next node_modules
npm install

# Restart both
cd ../backend && python manage.py runserver &
cd ../frontend && npm run dev
```

---

## 📞 Getting Help

### Check Documentation
1. README.md - Main documentation
2. SWAGGER_GUIDE.md - API documentation
3. FEATURES.md - Feature overview
4. TEST_REPORT.md - Test results

### Check Logs
- **Frontend**: Browser console (F12)
- **Backend**: Terminal output
- **Network**: Browser DevTools → Network tab

### Verify Setup
```bash
# Backend
cd backend
source venv/bin/activate
python manage.py check

# Frontend
cd frontend
npm run build
```

---

## ✅ Health Check

Run these to verify everything works:

```bash
# Backend health
curl http://localhost:8000/api/schema/ | head -5

# Frontend health
curl http://localhost:3000 | grep title

# Database health
cd backend
source venv/bin/activate
python manage.py dbshell
\l  # List databases
\q  # Quit
```

---

## 🎯 Prevention Tips

1. **Always activate venv** before running Python commands
2. **Check terminal output** for errors
3. **Use Swagger UI** for API testing
4. **Keep dependencies updated** (carefully)
5. **Read error messages** completely
6. **Check documentation** before asking
7. **Use git** to track changes

---

## 📝 Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Module not found" | Import path wrong | Fix import path |
| "Port already in use" | Server running | Kill process |
| "401 Unauthorized" | Token invalid | Login again |
| "CORS error" | CORS not configured | Check settings.py |
| "Database error" | DB not running | Start PostgreSQL |
| "Migration error" | DB out of sync | Run migrations |

---

**Still stuck?** Check the documentation files or review the code carefully. Most issues are simple typos or configuration problems! 🔍
