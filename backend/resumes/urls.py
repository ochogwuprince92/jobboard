from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet

app_name = "resumes"

router = DefaultRouter()
router.register("resumes", ResumeViewSet, basename="resume")

urlpatterns = router.urls
