# scraper/parsers/indeed_scraper.py
"""
IndeedScraper - scrapes job postings from Indeed Nigeria.
Uses BeautifulSoup (HTML parsing) and requests.
"""

import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from .base_scraper import BaseScraper
from scraper.config import HEADERS, JOB_SOURCES


class IndeedScraper(BaseScraper):
    def fetch_jobs(self) -> List[Dict]:
        url_template = JOB_SOURCES["indeed"]["url"]
        url = url_template.format(keyword=self.keyword, location=self.location)

        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch page: {response.status_code}")

        soup = BeautifulSoup(response.text, "html.parser")
        jobs = []

        for job_card in soup.select(".job_seen_beacon"):
            title_el = job_card.select_one(".jobTitle span")
            company_el = job_card.select_one(".companyName")
            location_el = job_card.select_one(".companyLocation")

            if not title_el or not company_el:
                continue

            jobs.append({
                "title": title_el.text.strip(),
                "company": company_el.text.strip(),
                "location": location_el.text.strip() if location_el else "N/A",
                "source": "Indeed",
                "url": "https://ng.indeed.com"  # Can extract detail link later
            })

        return jobs
