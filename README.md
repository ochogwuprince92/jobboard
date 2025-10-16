# Job Board MVP

A full-stack job board application built with Django REST Framework (backend) and React (frontend).

## Features

### Backend (Django REST Framework)
- **User Authentication**: Email/phone-based registration with OTP verification
- **JWT Authentication**: Secure token-based authentication
- **Job Management**: CRUD operations for job listings
- **Employer Profiles**: Company profiles and job posting management
- **Resume Management**: Upload and manage resumes
- **Job Applications**: Apply to jobs and track application status
- **Web Scraping**: Automated job scraping from external sources
- **Notifications**: Email notifications for important events
- **Admin Panel**: Django admin interface for management

### Apps Structure
- `users`: User authentication and profile management
- `jobs`: Job listings and applications
- `employers`: Employer profiles and company management
- `resumes`: Resume upload and management
- `scraper`: Web scraping functionality for job aggregation
- `notifications`: Email and notification system
- `ai`: AI-powered features (future enhancements)

## Tech Stack

### Backend
- Django 5.2.7
- Django REST Framework 3.16.1
- PostgreSQL (via psycopg2-binary)
- Redis (for caching and Celery)
- Celery 5.5.3 (background tasks)
- JWT Authentication (djangorestframework-simplejwt)
- Selenium & BeautifulSoup4 (web scraping)

### Frontend
- React (in `/frontend` directory)

## Prerequisites

- Python 3.12+
- PostgreSQL 17
- Redis 7
- Docker & Docker Compose (optional)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jobboard
```

### 2. Backend Setup

#### Option A: Using Virtual Environment (Recommended for Development)

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Linux/Mac
# or
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

#### Option B: Using Docker Compose

```bash
# Start all services (database, redis, web, celery)
docker-compose up -d
```

### 3. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgres://postgres:ogwaa123@localhost:5432/jobboard

# Redis
REDIS_URL=redis://localhost:6379/0

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT Token Lifetimes
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# OTP
OTP_EXPIRATION_MINUTES=10
```

### 4. Database Setup

Ensure PostgreSQL and Redis are running:

```bash
# Check if services are running
sudo systemctl status postgresql
sudo systemctl status redis

# Or start them if needed
sudo systemctl start postgresql
sudo systemctl start redis
```

Run migrations:

```bash
cd backend
source venv/bin/activate  # If using virtual environment
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run the Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### 7. Start Celery Worker (Optional)

For background tasks like email sending and web scraping:

```bash
# In a new terminal
cd backend
source venv/bin/activate
celery -A jobboard worker -l info

# In another terminal for periodic tasks
celery -A jobboard beat -l info
```

## API Documentation

### 📚 Interactive API Documentation (Swagger)

The API includes **interactive Swagger/OpenAPI documentation**:

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **OpenAPI Schema**: `http://localhost:8000/api/schema/`

See [SWAGGER_GUIDE.md](SWAGGER_GUIDE.md) for detailed usage instructions.

## API Endpoints

### Authentication
- `POST /api/register/` - Register new user
- `POST /api/verify-email/` - Verify email with OTP
- `POST /api/login/` - Login user
- `POST /api/forgot-password/` - Request password reset
- `POST /api/reset-password/` - Reset password with OTP

### Jobs
- `GET /api/jobs/` - List all jobs (with filters)
- `POST /api/jobs/` - Create new job (employer only)
- `GET /api/jobs/{id}/` - Get job details
- `PUT /api/jobs/{id}/` - Update job
- `DELETE /api/jobs/{id}/` - Delete job

### Applications
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Apply to a job
- `GET /api/applications/{id}/` - Get application details

### Employers
- `GET /api/employers/` - List employers
- `POST /api/employers/` - Create employer profile
- `GET /api/employers/{id}/` - Get employer details

### Resumes
- `GET /api/resumes/` - List resumes
- `POST /api/resumes/` - Upload resume
- `GET /api/resumes/{id}/` - Get resume details

### Scraper 🆕
- `POST /api/scrape/` - Trigger job scraping (admin only)
- `GET /api/scraped-jobs/` - List scraped jobs from external sources

### AI Features 🤖
- `POST /api/parse-resume/` - Parse resume and extract structured data
- `POST /api/extract-skills/` - Extract and categorize skills from text
- `POST /api/match-resume-job/` - Calculate match score between resume and job
- `GET /api/job-recommendations/` - Get personalized job recommendations

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`

## Project Structure

```
jobboard/
├── backend/
│   ├── jobboard/          # Project settings
│   ├── users/             # User authentication
│   ├── jobs/              # Job listings
│   ├── employers/         # Employer profiles
│   ├── resumes/           # Resume management
│   ├── scraper/           # Web scraping
│   ├── notifications/     # Notifications
│   ├── ai/                # AI features
│   ├── core/              # Core utilities
│   ├── manage.py
│   └── requirements.txt
├── frontend/              # React frontend
├── docker-compose.yml
├── .env.example
└── README.md
```

## Development

### Running Tests

```bash
cd backend
python manage.py test
```

### Code Style

The project follows Django and PEP 8 coding standards.

## Troubleshooting

### Port Already in Use
If PostgreSQL or Redis ports are already in use, you can either:
1. Use the existing services (recommended)
2. Change ports in `docker-compose.yml`

### Migration Issues
If you encounter migration issues:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Celery Not Working
Ensure Redis is running:
```bash
redis-cli ping  # Should return PONG
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license here]
