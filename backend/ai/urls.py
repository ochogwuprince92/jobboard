from django.urls import path
from . import views

app_name = "ai"

urlpatterns = [
    path("parse-resume/", views.parse_resume, name="parse-resume"),
    path("extract-skills/", views.extract_skills, name="extract-skills"),
    path("match-resume-job/", views.match_resume_to_job, name="match-resume-job"),
    path("job-recommendations/", views.get_job_recommendations, name="job-recommendations"),
]
