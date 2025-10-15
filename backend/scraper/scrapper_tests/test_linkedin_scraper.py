# scraper/tests/test_linkedin_scraper.py
import unittest
from unittest.mock import patch, MagicMock
from scraper.parsers.linkedin_scraper import LinkedInScraper

class FakeElement:
    """Minimal fake element exposing .text and find_element(s) behavior."""
    def __init__(self, title, company, location, url=None):
        self._title = title
        self._company = company
        self._location = location
        self._url = url

    @property
    def text(self):
        # for title/company/location elements, caller uses .text
        return self._title

    def find_element(self, css):
        # return another FakeElement for nested elements; map by selector string
        selector = css if isinstance(css, str) else getattr(css, "value", "")
        if "h3" in selector:
            return FakeElement(self._title, "", "")
        if "h4" in selector:
            return FakeElement(self._company, "", "")
        if "job-search-card__location" in selector or "job-search-card__location" in selector:
            return FakeElement(self._location, "", "")
        raise Exception("selector not handled")

    def find_elements(self, css):
        if "a" in css:
            # return list containing a fake anchor-like object with get_attribute
            link = MagicMock()
            link.get_attribute.return_value = self._url or "https://linkedin.example/job/1"
            return [link]
        return []

class TestLinkedInScraper(unittest.TestCase):
    @patch("scraper.parsers.linkedin_scraper.ChromeDriverManager")
    @patch("scraper.parsers.linkedin_scraper.webdriver.Chrome")
    def test_fetch_jobs_with_mocked_driver(self, mock_webdriver, mock_driver_manager):
        """
        Test LinkedInScraper.fetch_jobs by mocking webdriver.Chrome to return a fake driver
        with find_elements(...) returning fake job elements.
        """
        # prepare fake driver
        fake_driver = MagicMock()

        # fake find_elements returns a list of fake job list elements
        fake_list_item1 = FakeElement("Backend Developer", "NextGen", "Lagos", "https://linkedin/job/1")
        fake_list_item2 = FakeElement("Frontend Developer", "NextGen", "Lagos", "https://linkedin/job/2")
        fake_driver.find_elements.return_value = [fake_list_item1, fake_list_item2]

        # patch webdriver.Chrome(...) to return our fake driver
        mock_webdriver.return_value = fake_driver

        # also patch ChromeDriverManager.install to avoid network calls
        mock_driver_manager.return_value.install.return_value = "/path/to/chromedriver"

        scraper = LinkedInScraper(keyword="python", location="Lagos", headless=True, max_pages=1)
        jobs = scraper.fetch_jobs()

        # assert we got the two jobs extracted
        self.assertIsInstance(jobs, list)
        self.assertEqual(len(jobs), 2)
        titles = [j["title"] for j in jobs]
        self.assertIn("Backend Developer", titles)
        self.assertIn("Frontend Developer", titles)

if __name__ == "__main__":
    unittest.main()
