# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Start the Server

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Server will be running at: **http://localhost:8000/**

### 2. Access Swagger Documentation

Open in your browser:
```
http://localhost:8000/api/docs/
```

You'll see the interactive API documentation with all endpoints organized by category.

### 3. Create a Test User

**Using Swagger UI:**
1. Find `POST /api/register/` under **Users** section
2. Click **"Try it out"**
3. Use this test data:
```json
{
  "email": "test@example.com",
  "phone_number": "+1234567890",
  "first_name": "Test",
  "last_name": "User",
  "password": "testpass123",
  "is_employer": false
}
```
4. Click **"Execute"**

**Using cURL:**
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone_number": "+1234567890",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpass123",
    "is_employer": false
  }'
```

### 4. Login and Get Token

**Using Swagger UI:**
1. Find `POST /api/login/`
2. Click **"Try it out"**
3. Enter credentials:
```json
{
  "email": "test@example.com",
  "password": "testpass123"
}
```
4. Click **"Execute"**
5. Copy the `access` token from the response

**Using cURL:**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 5. Authorize in Swagger

1. Click the **"Authorize"** button (🔒 icon) at the top of Swagger UI
2. Enter: `Bearer YOUR_ACCESS_TOKEN` (replace with your actual token)
3. Click **"Authorize"**
4. Click **"Close"**

Now all your requests will be authenticated!

### 6. Try AI Features

#### Parse a Resume

Find `POST /api/parse-resume/` under **AI** section:

```json
{
  "resume_text": "John Doe\njohn.doe@email.com\n+1-555-0123\n\nSenior Software Engineer with 7 years of experience in Python, Django, and React.\n\nEducation:\nBachelor of Science in Computer Science\nStanford University\n\nSkills:\n- Python, Django, Flask\n- JavaScript, React, Node.js\n- PostgreSQL, MongoDB\n- AWS, Docker, Kubernetes\n- Machine Learning, TensorFlow"
}
```

**Response:**
```json
{
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "skills": {
    "programming_languages": ["python", "javascript"],
    "web_frameworks": ["django", "flask", "react", "nodejs"],
    "databases": ["postgresql", "mongodb"],
    "cloud_devops": ["aws", "docker", "kubernetes"],
    "data_science": ["machine learning", "tensorflow"]
  },
  "all_skills": ["python", "django", "flask", "javascript", "react", ...],
  "education": ["bachelor of science in computer science"],
  "experience_years": 7
}
```

#### Extract Skills from Job Description

Find `POST /api/extract-skills/`:

```json
{
  "text": "We are looking for a Senior Python Developer with 5+ years of experience. Must have expertise in Django, PostgreSQL, and AWS. Experience with React and Docker is a plus."
}
```

**Response:**
```json
{
  "skills": {
    "programming_languages": ["python"],
    "web_frameworks": ["django", "react"],
    "databases": ["postgresql"],
    "cloud_devops": ["aws", "docker"]
  },
  "all_skills": ["python", "django", "postgresql", "aws", "react", "docker"]
}
```

### 7. Browse All Endpoints

Swagger UI organizes endpoints into these categories:

- **👤 Users** - Authentication, registration, password reset
- **💼 Jobs** - Job listings, create, update, delete
- **📝 Applications** - Apply to jobs, track applications
- **🏢 Employers** - Company profiles, employer management
- **📄 Resumes** - Upload and manage resumes
- **🕷️ Scraper** - Automated job scraping (admin only)
- **🤖 AI** - Resume parsing, skill extraction, job matching

### 8. Common Workflows

#### For Job Seekers

1. **Register** → `POST /api/register/`
2. **Verify Email** → `POST /api/verify-email/`
3. **Login** → `POST /api/login/`
4. **Upload Resume** → `POST /api/resumes/`
5. **Get Recommendations** → `GET /api/job-recommendations/?resume_id=1`
6. **Apply to Job** → `POST /api/applications/`

#### For Employers

1. **Register** (with `is_employer: true`) → `POST /api/register/`
2. **Create Company Profile** → `POST /api/employers/`
3. **Post Job** → `POST /api/jobs/`
4. **View Applications** → `GET /api/applications/?job=1`
5. **Match Candidates** → `POST /api/match-resume-job/`

#### For Admins

1. **Access Admin Panel** → http://localhost:8000/admin/
2. **Trigger Scraping** → `POST /api/scrape/?keyword=python&async=true`
3. **View Scraped Jobs** → `GET /api/scraped-jobs/`

## 🎯 Quick Tips

### Testing with Swagger
- Use the **"Try it out"** button on any endpoint
- Swagger validates your input before sending
- See real-time responses with proper formatting
- Download request as cURL for command-line use

### Authentication
- Access tokens expire after 60 minutes (configurable)
- Use refresh token to get new access token
- Always include `Bearer` prefix in Authorization header

### Filtering Jobs
```
GET /api/jobs/?location=New York&employment_type=full-time&min_salary=80000
```

### Pagination
```
GET /api/jobs/?page=2&page_size=20
```

### Ordering
```
GET /api/jobs/?ordering=-posted_at  # Newest first
```

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **Swagger Guide**: See [SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)
- **Features Overview**: See [FEATURES.md](FEATURES.md)
- **API Testing**: See [API_TESTING.md](API_TESTING.md)

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 8000 is in use
lsof -i :8000

# Kill existing process
pkill -f runserver

# Restart server
python manage.py runserver
```

### Database errors
```bash
# Run migrations
python manage.py migrate

# Check database connection
python manage.py dbshell
```

### Authentication errors
- Make sure you've included the Bearer token
- Check if token has expired
- Verify token format: `Bearer <token>`

### CORS errors
- Check `CORS_ALLOWED_ORIGINS` in settings
- Ensure frontend URL is whitelisted

## 🎉 You're Ready!

You now have:
- ✅ A running Django server
- ✅ Interactive API documentation
- ✅ AI-powered features
- ✅ Web scraping capabilities
- ✅ Complete authentication system

Start building your frontend or explore the API with Swagger UI!

**Happy coding! 🚀**
