# scraper/tests/test_services.py
import unittest
from unittest.mock import patch, MagicMock
from scraper.services import ScraperService

class TestScraperService(unittest.TestCase):
    @patch("importlib.import_module")
    def test_run_all_scrapers_aggregates_results(self, mock_import_module):
        """
        Test ScraperService.run_all_scrapers by mocking the importlib import
        to return a module containing a scraper class whose fetch_jobs returns a predictable result.
        """
        # create a fake scraper class that returns specific jobs
        FakeScraperClass = MagicMock()
        FakeScraperClass.return_value.fetch_jobs.return_value = [
            {"title": "Job A", "company": "CoA", "location": "Lagos", "source": "Fake"},
        ]
        fake_module = MagicMock()
        fake_module.FakeScraper = FakeScraperClass

        # importlib.import_module should return our fake module (first call)
        mock_import_module.return_value = fake_module

        # patch JOB_SOURCES to point to our fake parser path
        with patch("scraper.services.JOB_SOURCES", {"fake": {"enabled": True, "parser": "fake_module.FakeScraper"}}):
            service = ScraperService(keyword="x", location="y")
            jobs = service.run_all_scrapers()
            # Should aggregate the single job from FakeScraper
            self.assertEqual(len(jobs), 1)
            self.assertEqual(jobs[0]["title"], "Job A")

if __name__ == "__main__":
    unittest.main()
