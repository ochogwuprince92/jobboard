# Job Board Features Overview

## 🎯 Core Features

### User Management
- ✅ Email/Phone registration with OTP verification
- ✅ JWT-based authentication
- ✅ Password reset with OTP
- ✅ User profiles (Job Seekers & Employers)

### Job Listings
- ✅ Create, read, update, delete jobs
- ✅ Job filtering (location, type, salary, etc.)
- ✅ Job tags/categories
- ✅ Active/inactive status management
- ✅ Salary range support

### Applications
- ✅ Apply to jobs with resume
- ✅ Cover letter support
- ✅ Application status tracking
- ✅ Application history

### Employer Profiles
- ✅ Company information management
- ✅ Multiple job postings per employer
- ✅ Company size and industry tracking

### Resume Management
- ✅ Upload multiple resumes
- ✅ Resume file storage
- ✅ Resume versioning

## 🤖 AI-Powered Features

### Resume Parsing
**Endpoint**: `POST /api/parse-resume/`

Automatically extracts:
- 📧 Email addresses
- 📱 Phone numbers
- 💼 Skills (categorized by type)
- 🎓 Education history
- 📅 Years of experience

**Example**:
```json
{
  "email": "john@example.com",
  "phone": "+1234567890",
  "skills": {
    "programming_languages": ["python", "javascript"],
    "web_frameworks": ["django", "react"],
    "databases": ["postgresql", "mongodb"]
  },
  "experience_years": 5
}
```

### Skill Extraction
**Endpoint**: `POST /api/extract-skills/`

Extracts and categorizes skills from any text:
- Programming Languages (Python, Java, JavaScript, etc.)
- Web Frameworks (Django, React, Angular, etc.)
- Databases (PostgreSQL, MongoDB, Redis, etc.)
- Cloud/DevOps (AWS, Docker, Kubernetes, etc.)
- Data Science (ML, TensorFlow, Pandas, etc.)
- Soft Skills (Leadership, Communication, etc.)

### Job-Resume Matching
**Endpoint**: `POST /api/match-resume-job/`

Calculates compatibility between resume and job:
- 📊 Overall match score (0-100%)
- 🎯 Skill match percentage
- 📝 Text similarity score
- ✅ Matched skills list
- ❌ Missing skills list
- 🏆 Match level (Excellent/Good/Fair/Poor)

**Example**:
```json
{
  "overall_score": 75.5,
  "skill_match": 80.0,
  "text_similarity": 68.5,
  "match_level": "Excellent",
  "matched_skills": ["python", "django", "postgresql"],
  "missing_skills": ["react", "aws"]
}
```

### Personalized Job Recommendations
**Endpoint**: `GET /api/job-recommendations/?resume_id=1&limit=10`

Get AI-powered job recommendations:
- Analyzes user's resume
- Compares with all active jobs
- Ranks by match score
- Returns top N recommendations
- Includes matched skills for each job

## 🕷️ Web Scraping Features

### Automated Job Scraping
**Endpoint**: `POST /api/scrape/` (Admin only)

Features:
- Scrape jobs from multiple sources
- Configurable keywords and locations
- Async processing with Celery
- Retry mechanism with exponential backoff
- Duplicate detection
- Source tracking

**Query Parameters**:
- `keyword` - Job search keyword (e.g., "python developer")
- `location` - Location filter (e.g., "New York")
- `async` - Run asynchronously (true/false)

### Scraped Jobs Management
**Endpoint**: `GET /api/scraped-jobs/`

- View all scraped jobs
- Filter by source website
- Track creation/update dates
- Unique job URLs

## 📚 API Documentation

### Interactive Swagger UI
**URL**: `http://localhost:8000/api/docs/`

Features:
- 🎮 Interactive API testing
- 🔐 Built-in authentication
- 📖 Detailed endpoint documentation
- 💡 Request/response examples
- ✅ Schema validation
- 📥 Download OpenAPI schema

### ReDoc Documentation
**URL**: `http://localhost:8000/api/redoc/`

Alternative documentation with:
- Clean, readable interface
- Searchable endpoints
- Code samples
- Detailed schemas

## 🔒 Security Features

- JWT token authentication
- Token expiration (configurable)
- Refresh token support
- Rate limiting (100 req/day for anonymous, 1000/day for users)
- CORS protection
- OTP verification for sensitive operations
- Admin-only endpoints for critical operations

## 🔄 Background Tasks (Celery)

- Automated job scraping (scheduled)
- Email sending (OTP, notifications)
- Async job processing
- Periodic cleanup tasks

## 📊 Filtering & Search

### Job Filters
- Location
- Employment type (full-time, part-time, contract, internship)
- Salary range (min/max)
- Job tags
- Active status
- Posted date

### Sorting
- By posted date (newest/oldest)
- By salary (highest/lowest)
- By relevance (with AI matching)

## 🎨 Technology Stack

### Backend
- **Framework**: Django 5.2.7
- **API**: Django REST Framework 3.16.1
- **Database**: PostgreSQL 17
- **Cache/Queue**: Redis 7
- **Task Queue**: Celery 5.5.3
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Documentation**: drf-spectacular (Swagger/OpenAPI)
- **Web Scraping**: Selenium, BeautifulSoup4

### AI/ML
- Python regex for parsing
- Text similarity algorithms (Jaccard)
- Keyword-based skill extraction
- Custom matching algorithms

## 🚀 Performance Optimizations

- Database query optimization
- Pagination for large datasets
- Async task processing
- Redis caching
- Efficient skill matching algorithms
- Bulk operations for scraping

## 📈 Future Enhancements

Potential additions:
- [ ] Advanced ML models for resume parsing (spaCy, BERT)
- [ ] Semantic similarity using embeddings
- [ ] Real-time notifications (WebSockets)
- [ ] Advanced search with Elasticsearch
- [ ] Job alerts based on preferences
- [ ] Interview scheduling
- [ ] Video resume support
- [ ] Skill assessments/tests
- [ ] Company reviews and ratings
- [ ] Salary insights and analytics

## 🎯 Use Cases

### For Job Seekers
1. Upload resume → Get automatic parsing
2. Browse jobs → See match scores
3. Get personalized recommendations
4. Apply with one click
5. Track application status

### For Employers
1. Post jobs with detailed requirements
2. View applicant match scores
3. Filter candidates by skills
4. Automated candidate ranking
5. Manage multiple job postings

### For Admins
1. Trigger job scraping
2. Monitor scraped jobs
3. Manage all users and jobs
4. View system analytics
5. Configure scraping sources

## 📞 API Rate Limits

- **Anonymous users**: 100 requests/day
- **Authenticated users**: 1000 requests/day
- **Login attempts**: 5/minute
- **OTP requests**: 3/hour

## 🔗 Quick Links

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Admin Panel**: http://localhost:8000/admin/
- **API Root**: http://localhost:8000/api/

## 📝 Notes

- All AI features work offline (no external API calls)
- Skill database can be easily extended
- Matching algorithms are customizable
- Scraper supports multiple job sites (configurable)
- All endpoints return JSON responses
- Comprehensive error messages for debugging
