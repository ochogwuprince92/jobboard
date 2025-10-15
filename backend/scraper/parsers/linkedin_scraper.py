
"""
LinkedInScraper - uses Selenium to render JavaScript-heavy LinkedIn Jobs pages
and extract a list of job dictionaries.

This scraper is designed to be used in headless mode and to be robust to
delays in page loading by using explicit waits.

IMPORTANT: This file requires the `selenium` and `webdriver-manager` packages
for real runs. Unit tests mock the driver so they don't need a real browser.
"""

from typing import List, Dict
from .base_scraper import BaseScraper
from scraper.config import HEADERS
import time

# selenium imports
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# webdriver-manager will install the chromedriver automatically at runtime
from webdriver_manager.chrome import ChromeDriverManager

class LinkedInScraper(BaseScraper):
    def __init__(self, keyword: str, location: str, headless: bool = True, max_pages: int = 1):
        """
        :param keyword: job keyword to search for
        :param location: location string
        :param headless: run Chrome in headless mode
        :param max_pages: how many pages to paginate (default 1 for safety)
        """
        super().__init__(keyword, location)
        self.headless = headless
        self.max_pages = max_pages

    def _init_driver(self):
        """Initialize a headless Chrome driver using webdriver-manager."""
        options = Options()
        if self.headless:
            options.add_argument("--headless=new" if hasattr(options, "add_argument") else "--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument(f"user-agent={HEADERS.get('User-Agent')}")
        # create driver via webdriver-manager's ChromeDriverManager
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        return driver

    def fetch_jobs(self) -> List[Dict]:
        """Main entry that returns a list of job dicts from LinkedIn search results."""
        jobs: List[Dict] = []
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={self.keyword}&location={self.location}"

        driver = None
        try:
            driver = self._init_driver()
            driver.set_page_load_timeout(20)
            driver.get(search_url)

            # Wait for job results container to be present
            wait = WebDriverWait(driver, 10)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".jobs-search-results__list")))

            # simple pagination loop (safe with small max_pages)
            for page in range(self.max_pages):
                # find job cards; LinkedIn uses job-card containers
                job_cards = driver.find_elements(By.CSS_SELECTOR, ".jobs-search-results__list li")

                for el in job_cards:
                    try:
                        # title
                        title_el = el.find_element(By.CSS_SELECTOR, "h3")
                        # company
                        company_el = el.find_element(By.CSS_SELECTOR, "h4")
                        # location
                        location_el = el.find_element(By.CSS_SELECTOR, ".job-search-card__location")
                        # link (if anchor present)
                        link_el = el.find_elements(By.CSS_SELECTOR, "a")
                        url = link_el[0].get_attribute("href") if link_el else None

                        job = {
                            "title": title_el.text.strip(),
                            "company": company_el.text.strip(),
                            "location": location_el.text.strip(),
                            "source": "LinkedIn",
                            "url": url,
                        }
                        jobs.append(job)
                    except Exception:
                        # skip element on parsing issues; be defensive
                        continue

                # try to go to next page if available (safe break if not)
                try:
                    next_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Page next']")
                    if "artdeco-button--disabled" in next_btn.get_attribute("class"):
                        break
                    next_btn.click()
                    # wait for new page results to render
                    time.sleep(1)  # short sleep; explicit waits above are preferred but LinkedIn dynamic content varies
                    wait.until(EC.staleness_of(job_cards[0]) if job_cards else EC.presence_of_element_located((By.CSS_SELECTOR, ".jobs-search-results__list")))
                except Exception:
                    break

        finally:
            if driver:
                driver.quit()

        return jobs
