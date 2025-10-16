# Quick Reference Card

## 🚀 Start Commands

### Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```
**URL**: http://localhost:8000

### Frontend
```bash
cd frontend
npm run dev
```
**URL**: http://localhost:3000

### Celery (Optional)
```bash
cd backend
source venv/bin/activate
celery -A jobboard worker -l info
```

## 📚 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/ |
| Swagger UI | http://localhost:8000/api/docs/ |
| ReDoc | http://localhost:8000/api/redoc/ |
| Django Admin | http://localhost:8000/admin/ |
| AI Tools | http://localhost:3000/ai-tools |

## 🔑 Key Files

### Backend
```
backend/
├── jobboard/settings.py    # Django settings
├── jobboard/urls.py         # URL routing
├── requirements.txt         # Dependencies
└── manage.py                # Django CLI
```

### Frontend
```
frontend/
├── src/app/layout.tsx       # Root layout
├── src/app/providers.tsx    # Providers
├── src/context/AuthContext.tsx  # Auth
├── src/api/axiosClient.ts   # API client
└── src/types/index.ts       # TypeScript types
```

## 🎯 Common Tasks

### Create Superuser
```bash
cd backend
python manage.py createsuperuser
```

### Run Migrations
```bash
cd backend
python manage.py migrate
```

### Create New Migration
```bash
cd backend
python manage.py makemigrations
```

### Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## 📝 API Authentication

### Login
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### Use Token
```bash
curl -X GET http://localhost:8000/api/jobs/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔧 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key
DATABASE_URL=postgres://user:pass@localhost:5432/jobboard
REDIS_URL=redis://localhost:6379/0
DEBUG=True
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Check Redis
sudo systemctl status redis

# Check migrations
python manage.py showmigrations
```

### Frontend won't start
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Database issues
```bash
# Reset database (⚠️ destroys data)
python manage.py flush
python manage.py migrate
```

## 📊 Project Stats

- **Backend**: 15,000+ lines
- **Frontend**: 5,000+ lines
- **API Endpoints**: 50+
- **Components**: 25+
- **Documentation**: 10 files

## ✅ Feature Checklist

- [x] Authentication (JWT + OTP)
- [x] Job listings (CRUD)
- [x] Applications
- [x] Resumes
- [x] AI resume parsing
- [x] Job matching
- [x] Web scraping
- [x] Swagger docs
- [x] Responsive UI
- [x] Error handling

## 🎨 Color Scheme

```css
Primary: #667eea (purple-blue)
Secondary: #764ba2 (purple)
Success: #4CAF50 (green)
Warning: #FF9800 (orange)
Error: #F44336 (red)
```

## 📱 Responsive Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

## 🔐 Default Credentials

**Note**: Create your own superuser!

```bash
python manage.py createsuperuser
```

## 📞 Quick Links

- [Main README](README.md)
- [Swagger Guide](SWAGGER_GUIDE.md)
- [Features](FEATURES.md)
- [API Testing](API_TESTING.md)
- [Frontend Setup](FRONTEND_SETUP.md)
- [Final Summary](FINAL_SUMMARY.md)

---

**Keep this card handy for quick reference!** 📌
