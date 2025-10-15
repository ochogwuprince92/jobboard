# scraper/jobberman_scraper.py

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class JobbermanScraper:
    """
    Handles scraping job listings from Jobberman.
    """

    def __init__(self, keyword=None, location=None):
        self.keyword = keyword or ""
        self.location = location or ""

    def _init_driver(self):
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    def scrape(self):
        """
        Scrape job listings from Jobberman search results page.
        Returns a list of dictionaries with job info.
        """
        driver = self._init_driver()
        try:
            url = f"https://www.jobberman.com/jobs?keyword={self.keyword}&location={self.location}"
            driver.get(url)

            job_elements = driver.find_elements(By.CSS_SELECTOR, "div.job-list-item")

            jobs = []
            for elem in job_elements:
                try:
                    title_el = elem.find_element(By.CSS_SELECTOR, ".job-title")
                    company_el = elem.find_element(By.CSS_SELECTOR, ".company-name")
                    link_el = elem.find_element(By.CSS_SELECTOR, "a")

                    job = {
                        "title": title_el.text.strip(),
                        "company": company_el.text.strip() if company_el else "",
                        "link": link_el.get_attribute("href"),
                        "source": "jobberman",
                    }
                    jobs.append(job)
                except Exception:
                    continue

            return jobs
        finally:
            driver.quit()
