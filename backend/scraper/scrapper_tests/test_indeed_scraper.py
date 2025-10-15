import unittest
from unittest.mock import patch, MagicMock
from scraper.services import ScraperService

class TestIndeedScraper(unittest.TestCase):

    @patch("scraper.services.webdriver.Chrome")
    def test_scrape_indeed_returns_jobs(self, mock_driver_class):
        """
        Test that ScraperService.scrape_indeed returns a list of jobs
        with the expected fields.
        """

        # Mock Chrome driver
        mock_driver = MagicMock()
        mock_driver_class.return_value = mock_driver

        # Mock individual job element
        mock_elem = MagicMock()

        def find_element_side_effect(by, selector):
            if "jobTitle" in selector:
                return MagicMock(text="Python Developer")
            elif "companyName" in selector:
                return MagicMock(text="TechCorp")
            elif "companyLocation" in selector:
                return MagicMock(text="Lagos")
            elif selector == "a":
                return MagicMock(get_attribute=lambda attr: "https://indeed.com/job/1")
            else:
                return MagicMock(text="")

        mock_elem.find_element.side_effect = find_element_side_effect

        # Simulate multiple job elements on the page
        mock_driver.find_elements.return_value = [mock_elem, mock_elem]

        # Initialize ScraperService (keyword/location can be anything)
        service = ScraperService(keyword="Python", location="Lagos")
        jobs = service.scrape_indeed()

        # --- Assertions ---
        self.assertIsInstance(jobs, list)
        self.assertGreaterEqual(len(jobs), 1)

        first_job = jobs[0]
        self.assertEqual(first_job["title"], "Python Developer")
        self.assertEqual(first_job["company"], "TechCorp")
        self.assertEqual(first_job["location"], "Lagos")
        self.assertEqual(first_job["source"], "indeed")
        self.assertTrue(first_job["url"].startswith("https://indeed.com"))

if __name__ == "__main__":
    unittest.main()
