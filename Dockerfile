FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /code

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /code/backend/
RUN pip install --upgrade pip
RUN pip install -r /code/backend/requirements.txt

# Copy project
COPY . /code/

# Set the working directory to backend
WORKDIR /code/backend

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]