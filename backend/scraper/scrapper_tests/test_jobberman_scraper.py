# scraper/tests/test_jobberman_scraper.py
import unittest
from unittest.mock import patch, MagicMock
from scraper.services import ScraperService

class TestJobbermanScraper(unittest.TestCase):

    @patch("scraper.services.webdriver.Chrome")
    def test_scrape_jobberman_returns_jobs(self, mock_driver_class):
        # Mock driver and elements
        mock_driver = MagicMock()
        mock_driver_class.return_value = mock_driver
        mock_elem = MagicMock()
        mock_elem.find_element.side_effect = lambda by, selector: MagicMock(text="Test" if "text" in selector else "http://link")
        mock_driver.find_elements.return_value = [mock_elem, mock_elem]

        service = ScraperService(keyword="Python", location="Lagos")
        jobs = service.scrape_jobberman()

        self.assertIsInstance(jobs, list)
        self.assertGreaterEqual(len(jobs), 1)
        self.assertIn("title", jobs[0])
        self.assertEqual(jobs[0]["source"], "jobberman")

if __name__ == "__main__":
    unittest.main()
