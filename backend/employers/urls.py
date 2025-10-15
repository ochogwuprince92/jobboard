from rest_framework.routers import DefaultRouter
from .views import EmployerViewSet

app_name = "employers"

router = DefaultRouter()
router.register(r"employers", EmployerViewSet, basename="employer")

urlpatterns = router.urls
