from django.urls import path
from . import views

app_name = "scraper"

urlpatterns = [
    path("scrape/", views.trigger_scraping, name="trigger-scraping"),
    path("scraped-jobs/", views.list_scraped_jobs, name="list-scraped-jobs"),
]
