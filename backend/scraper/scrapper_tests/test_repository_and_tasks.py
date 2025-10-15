# scraper/tests/test_repository_and_tasks.py
import unittest
from unittest.mock import patch, MagicMock
from scraper.repository import ScraperRepository
from scraper.tasks import run_scrapers_task
from jobs.models import Job


class TestScraperRepository(unittest.TestCase):
    @patch("jobs.models.Job.objects")
    def test_save_jobs_creates_new_records(self, mock_manager):
        fake_jobs = [
            {"title": "Python Dev", "company": "TechCorp", "location": "Lagos", "url": "http://x"},
            {"title": "Python Dev", "company": "TechCorp", "location": "Lagos", "url": "http://x"},
        ]
        mock_manager.filter.return_value.exists.return_value = False
        ScraperRepository.save_jobs(fake_jobs)
        self.assertEqual(mock_manager.create.call_count, 2)


class TestScraperTask(unittest.TestCase):
    @patch("scraper.tasks.ScraperRepository.save_jobs", return_value=5)
    @patch("scraper.tasks.ScraperService.run_all_scrapers")
    def test_run_scrapers_task_success(self, mock_run_all, mock_save_jobs):
        mock_run_all.return_value = [{"title": "Backend Dev"}]
        result = run_scrapers_task("python", "Lagos")
        self.assertEqual(result["status"], "success")
        self.assertEqual(result["new_jobs"], 5)


if __name__ == "__main__":
    unittest.main()
