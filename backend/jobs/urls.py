from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobApplicationViewSet

app_name = "jobs"

router = DefaultRouter()
router.register(r"jobs", JobViewSet, basename="job")
router.register(r"applications", JobApplicationViewSet, basename="application")

urlpatterns = router.urls
