from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobApplicationViewSet, SavedJobViewSet

app_name = "jobs"

router = DefaultRouter()
router.register(r"jobs", JobViewSet, basename="job")
router.register(r"applications", JobApplicationViewSet, basename="application")
router.register(r"saved-jobs", SavedJobViewSet, basename="saved-job")

urlpatterns = router.urls
