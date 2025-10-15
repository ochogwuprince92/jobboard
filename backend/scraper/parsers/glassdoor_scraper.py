# scraper/services/glassdoor_scraper.py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

class GlassdoorScraper:
    """
    Scraper for Glassdoor job listings.
    """
    BASE_URL = "https://www.glassdoor.com/Job/jobs.htm"

    def __init__(self, keyword: str, location: str, max_pages: int = 2):
        self.keyword = keyword
        self.location = location
        self.max_pages = max_pages

        # Configure headless Chrome
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        self.driver = webdriver.Chrome(service=Service(), options=chrome_options)

    def scrape(self):
        """
        Scrape jobs from Glassdoor.
        Returns a list of dicts with job info.
        """
        jobs = []

        for page in range(1, self.max_pages + 1):
            url = f"{self.BASE_URL}?sc.keyword={self.keyword}&locT=C&locId=0&locKeyword={self.location}&p={page}"
            self.driver.get(url)
            time.sleep(2)  # wait for page to load

            job_cards = self.driver.find_elements(By.CLASS_NAME, "react-job-listing")
            if not job_cards:
                break

            for card in job_cards:
                try:
                    title = card.find_element(By.CLASS_NAME, "jobLink").text
                    company = card.find_element(By.CLASS_NAME, "jobHeader").text
                    location_elem = card.find_element(By.CLASS_NAME, "loc")
                    location = location_elem.text if location_elem else self.location
                    summary = card.find_element(By.CLASS_NAME, "jobDesc").text

                    jobs.append({
                        "title": title,
                        "company": company,
                        "location": location,
                        "description": summary,
                        "source": "Glassdoor",
                    })
                except Exception as e:
                    print(f"Skipping job card due to error: {e}")

        self.driver.quit()
        return jobs
