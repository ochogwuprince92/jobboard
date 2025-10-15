
"""
ScraperService - central orchestrator for all enabled job scrapers.
Each scraper fetches jobs from its respective source, and results
are aggregated into a unified job list.
"""

import importlib
import time
from typing import List, Dict
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from scraper.config import JOB_SITES, DEFAULT_SEARCH

import random

class ScraperService:
    """Main orchestrator for all scrapers."""

    def __init__(self, keyword: str = None, location: str = None):
        self.keyword = keyword or DEFAULT_SEARCH["keyword"]
        self.location = location or DEFAULT_SEARCH["location"]

    def _load_scraper(self, path: str):
        """Dynamically import scraper class from config path."""
        module_path, class_name = path.rsplit(".", 1)
        module = importlib.import_module(module_path)
        return getattr(module, class_name)

    def run_all_scrapers(self) -> List[Dict]:
        """Run all enabled scrapers and return a combined job list."""
        all_jobs = []

        for site_name, site_config in JOB_SITES.items():
            if not site_config["enabled"]:
                continue

            print(f"[ScraperService] Running scraper: {site_name}...")
            try:
                ScraperClass = self._load_scraper(site_config["parser"])
                scraper = ScraperClass(self.keyword, self.location)
                jobs = scraper.fetch_jobs()
                all_jobs.extend(jobs)
                print(f"[ScraperService] {site_name}: {len(jobs)} jobs found.")
            except Exception as e:
                print(f"[ScraperService][Error] {site_name}: {e}")

        return all_jobs

def run_all_scrapers(self) -> List[Dict]:
    """Run all enabled scrapers and return a combined job list."""
    all_jobs = []

    for site_name, site_config in JOB_SITES.items():
        if not site_config.get("enabled"):
            continue

        print(f"[ScraperService] Running scraper: {site_name}...")

        for attempt in range(3):  # retry up to 3 times
            try:
                ScraperClass = self._load_scraper(site_config["parser"])
                scraper = ScraperClass(self.keyword, self.location)
                jobs = scraper.fetch_jobs()
                all_jobs.extend(jobs)
                print(f"[ScraperService] {site_name}: {len(jobs)} jobs found.")
                break  # exit retry loop on success
            except Exception as e:
                wait = 2 ** attempt + random.random()
                print(f"[Retry {attempt+1}] {site_name} failed: {e}. Retrying in {wait:.1f}s...")
                time.sleep(wait)
        else:
            print(f"[ScraperService][Error] {site_name} failed after retries.")

    return all_jobs
