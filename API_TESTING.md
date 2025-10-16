# API Testing Guide

This guide provides examples for testing the Job Board API endpoints.

## Base URL
```
http://localhost:8000/api/
```

## Authentication

The API uses JWT (JSON Web Token) authentication. After logging in, include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## 1. User Registration

**Endpoint:** `POST /api/register/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "phone_number": "+1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "is_employer": false
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phone_number": "+1234567890",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123",
    "is_employer": false
  }'
```

## 2. Verify Email

**Endpoint:** `POST /api/verify-email/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "otp": "123456"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/verify-email/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

## 3. Login

**Endpoint:** `POST /api/login/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "is_employer": false
    }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

## 4. List Jobs

**Endpoint:** `GET /api/jobs/`

**Query Parameters:**
- `title` - Filter by job title
- `location` - Filter by location
- `employment_type` - Filter by employment type (full-time, part-time, contract, internship)
- `is_active` - Filter by active status (true/false)

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/jobs/ \
  -H "Authorization: Bearer <your_access_token>"
```

**With Filters:**
```bash
curl -X GET "http://localhost:8000/api/jobs/?location=New%20York&employment_type=full-time" \
  -H "Authorization: Bearer <your_access_token>"
```

## 5. Create Job (Employer Only)

**Endpoint:** `POST /api/jobs/`

**Request Body:**
```json
{
    "title": "Senior Python Developer",
    "company_id": 1,
    "location": "New York, NY",
    "description": "We are looking for an experienced Python developer...",
    "requirements": "5+ years of Python experience, Django, REST APIs",
    "min_salary": 80000,
    "max_salary": 120000,
    "employment_type": "full-time",
    "tag_ids": [1, 2, 3]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/jobs/ \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Python Developer",
    "company_id": 1,
    "location": "New York, NY",
    "description": "We are looking for an experienced Python developer...",
    "requirements": "5+ years of Python experience, Django, REST APIs",
    "min_salary": 80000,
    "max_salary": 120000,
    "employment_type": "full-time",
    "tag_ids": [1, 2, 3]
  }'
```

## 6. Get Job Details

**Endpoint:** `GET /api/jobs/{id}/`

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/jobs/1/ \
  -H "Authorization: Bearer <your_access_token>"
```

## 7. Apply to Job

**Endpoint:** `POST /api/applications/`

**Request Body:**
```json
{
    "job": 1,
    "resume": 1,
    "cover_letter": "I am very interested in this position..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/applications/ \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "job": 1,
    "resume": 1,
    "cover_letter": "I am very interested in this position..."
  }'
```

## 8. List Applications

**Endpoint:** `GET /api/applications/`

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/applications/ \
  -H "Authorization: Bearer <your_access_token>"
```

## 9. Create Employer Profile

**Endpoint:** `POST /api/employers/`

**Request Body:**
```json
{
    "company_name": "Tech Corp",
    "industry": "Technology",
    "company_size": "100-500",
    "website": "https://techcorp.com",
    "description": "Leading technology company...",
    "location": "San Francisco, CA"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/employers/ \
  -H "Authorization: Bearer <your_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Tech Corp",
    "industry": "Technology",
    "company_size": "100-500",
    "website": "https://techcorp.com",
    "description": "Leading technology company...",
    "location": "San Francisco, CA"
  }'
```

## 10. Upload Resume

**Endpoint:** `POST /api/resumes/`

**Request Body (multipart/form-data):**
```
title: "My Resume"
file: <resume.pdf>
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/resumes/ \
  -H "Authorization: Bearer <your_access_token>" \
  -F "title=My Resume" \
  -F "file=@/path/to/resume.pdf"
```

## 11. Forgot Password

**Endpoint:** `POST /api/forgot-password/`

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/forgot-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## 12. Reset Password

**Endpoint:** `POST /api/reset-password/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "newsecurepassword123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/reset-password/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456",
    "new_password": "newsecurepassword123"
  }'
```

## Testing with Postman

1. Import the API endpoints into Postman
2. Set up an environment variable for the base URL: `http://localhost:8000/api/`
3. After login, save the access token as an environment variable
4. Use `{{access_token}}` in the Authorization header

## Testing with Python Requests

```python
import requests

BASE_URL = "http://localhost:8000/api"

# Register
response = requests.post(f"{BASE_URL}/register/", json={
    "email": "test@example.com",
    "phone_number": "+1234567890",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpass123",
    "is_employer": False
})
print(response.json())

# Login
response = requests.post(f"{BASE_URL}/login/", json={
    "email": "test@example.com",
    "password": "testpass123"
})
data = response.json()
access_token = data['access']

# List jobs
headers = {"Authorization": f"Bearer {access_token}"}
response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
print(response.json())
```

## Common Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Notes

- All timestamps are in UTC
- File uploads should use `multipart/form-data`
- JSON requests should use `Content-Type: application/json`
- Authentication tokens expire after the configured lifetime (default: 60 minutes for access tokens)
- Use the refresh token to get a new access token without re-authenticating
