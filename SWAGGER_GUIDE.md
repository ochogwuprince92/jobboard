# Swagger API Documentation Guide

## Access Swagger UI

The Job Board API now has interactive Swagger/OpenAPI documentation available at:

### Swagger UI (Interactive)
```
http://localhost:8000/api/docs/
```

### ReDoc (Alternative Documentation)
```
http://localhost:8000/api/redoc/
```

### OpenAPI Schema (JSON)
```
http://localhost:8000/api/schema/
```

## Features

### 🎯 Interactive API Testing
- **Try it out**: Test API endpoints directly from the browser
- **Authentication**: Add JWT Bearer tokens for authenticated endpoints
- **Request/Response Examples**: See example payloads and responses
- **Schema Validation**: Automatic validation of request data

### 📚 API Categories

#### 1. **Authentication (Users)**
- `POST /api/register/` - Register new user
- `POST /api/verify-email/` - Verify email with OTP
- `POST /api/login/` - Login and get JWT tokens
- `POST /api/forgot-password/` - Request password reset
- `POST /api/reset-password/` - Reset password with OTP

#### 2. **Jobs**
- `GET /api/jobs/` - List all jobs (with filters)
- `POST /api/jobs/` - Create new job (employer only)
- `GET /api/jobs/{id}/` - Get job details
- `PUT /api/jobs/{id}/` - Update job
- `DELETE /api/jobs/{id}/` - Delete job

#### 3. **Applications**
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Apply to a job
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/` - Update application status

#### 4. **Employers**
- `GET /api/employers/` - List employers
- `POST /api/employers/` - Create employer profile
- `GET /api/employers/{id}/` - Get employer details
- `PUT /api/employers/{id}/` - Update employer profile

#### 5. **Resumes**
- `GET /api/resumes/` - List resumes
- `POST /api/resumes/` - Upload resume
- `GET /api/resumes/{id}/` - Get resume details
- `DELETE /api/resumes/{id}/` - Delete resume

#### 6. **Scraper** 🆕
- `POST /api/scrape/` - Trigger job scraping (admin only)
  - Query params: `keyword`, `location`, `async`
- `GET /api/scraped-jobs/` - List scraped jobs
  - Query params: `source`

#### 7. **AI Features** 🤖
- `POST /api/parse-resume/` - Parse resume and extract information
  - Extracts: email, phone, skills, education, experience
- `POST /api/extract-skills/` - Extract skills from text
  - Returns categorized skills (languages, frameworks, databases, etc.)
- `POST /api/match-resume-job/` - Match resume to job
  - Returns match score, matched skills, missing skills
- `GET /api/job-recommendations/` - Get personalized job recommendations
  - Query params: `resume_id`, `limit`

## How to Use Swagger UI

### 1. **Authentication**

Most endpoints require authentication. To authenticate:

1. First, login using the `/api/login/` endpoint
2. Copy the `access` token from the response
3. Click the **"Authorize"** button at the top of Swagger UI
4. Enter: `Bearer <your_access_token>`
5. Click **"Authorize"** and then **"Close"**

Now all authenticated requests will include your token automatically.

### 2. **Testing an Endpoint**

Example: Creating a new job

1. Navigate to the **Jobs** section
2. Find `POST /api/jobs/`
3. Click **"Try it out"**
4. Edit the request body:
```json
{
  "title": "Senior Python Developer",
  "company_id": 1,
  "location": "New York, NY",
  "description": "We are looking for an experienced Python developer...",
  "requirements": "5+ years Python, Django, PostgreSQL",
  "min_salary": 80000,
  "max_salary": 120000,
  "employment_type": "full-time",
  "tag_ids": [1, 2]
}
```
5. Click **"Execute"**
6. View the response below

### 3. **Using AI Features**

#### Parse Resume
```bash
POST /api/parse-resume/
{
  "resume_text": "John Doe\njohn@example.com\n+1234567890\n\nExperience:\n5 years of Python development...\n\nSkills: Python, Django, PostgreSQL, React"
}
```

Response:
```json
{
  "email": "john@example.com",
  "phone": "+1234567890",
  "skills": {
    "programming_languages": ["python"],
    "web_frameworks": ["django", "react"],
    "databases": ["postgresql"]
  },
  "all_skills": ["python", "django", "postgresql", "react"],
  "education": [],
  "experience_years": 5
}
```

#### Match Resume to Job
```bash
POST /api/match-resume-job/
{
  "resume_id": 1,
  "job_id": 5
}
```

Response:
```json
{
  "overall_score": 75.5,
  "skill_match": 80.0,
  "text_similarity": 68.5,
  "match_level": "Excellent",
  "matched_skills": ["python", "django", "postgresql"],
  "missing_skills": ["react", "aws"],
  "resume_skills": ["python", "django", "postgresql", "mongodb"],
  "job_skills": ["python", "django", "postgresql", "react", "aws"]
}
```

#### Get Job Recommendations
```bash
GET /api/job-recommendations/?resume_id=1&limit=5
```

Response:
```json
{
  "recommendations": [
    {
      "job_id": 1,
      "job_title": "Senior Python Developer",
      "company": "Tech Corp",
      "location": "New York, NY",
      "match_score": 85.5,
      "match_level": "Excellent",
      "matched_skills": ["python", "django", "postgresql"]
    }
  ]
}
```

### 4. **Using Scraper**

Trigger job scraping (admin only):
```bash
POST /api/scrape/?keyword=python&location=remote&async=true
```

Response:
```json
{
  "message": "Scraping task queued",
  "task_id": "abc123-def456"
}
```

List scraped jobs:
```bash
GET /api/scraped-jobs/?source=indeed
```

## Advanced Features

### Filtering Jobs
```
GET /api/jobs/?location=New York&employment_type=full-time&min_salary=80000
```

### Pagination
Most list endpoints support pagination:
```
GET /api/jobs/?page=2&page_size=20
```

### Ordering
```
GET /api/jobs/?ordering=-posted_at  # Newest first
GET /api/jobs/?ordering=min_salary  # Lowest salary first
```

## Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `202 Accepted` - Request accepted (async processing)
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Tips

1. **Use the Schema**: Click on any endpoint to see the full request/response schema
2. **Examples**: Look at the example values for guidance on request format
3. **Validation**: Swagger will show validation errors before sending the request
4. **Download Schema**: Download the OpenAPI schema for use with other tools
5. **Test Environment**: Use Swagger UI for quick testing during development

## Integration with Other Tools

### Postman
1. Download the OpenAPI schema from `/api/schema/`
2. Import into Postman: File → Import → Paste the schema URL

### Code Generation
Use the OpenAPI schema to generate client SDKs:
```bash
# Install openapi-generator
npm install @openapitools/openapi-generator-cli -g

# Generate Python client
openapi-generator-cli generate -i http://localhost:8000/api/schema/ -g python -o ./client
```

## Troubleshooting

### "401 Unauthorized" Error
- Make sure you're logged in and have added the Bearer token
- Check if your token has expired (default: 60 minutes)
- Use the refresh token to get a new access token

### "403 Forbidden" Error
- Check if your user has the required permissions
- Some endpoints (like scraping) require admin privileges

### CORS Issues
- Make sure your frontend URL is in `CORS_ALLOWED_ORIGINS` in settings
- Check that CORS headers are properly configured

## Support

For issues or questions:
1. Check the API response error messages
2. Review the endpoint documentation in Swagger
3. Check server logs for detailed error information
4. Refer to the main README.md for setup instructions
