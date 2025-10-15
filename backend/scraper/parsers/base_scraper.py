
"""
BaseScraper defines the common interface for all job scrapers.
Each subclass must implement the `fetch_jobs` method.
"""

from abc import ABC, abstractmethod
from typing import List, Dict

class BaseScraper(ABC):
    def __init__(self, keyword: str, location: str):
        self.keyword = keyword
        self.location = location

    @abstractmethod
    def fetch_jobs(self) -> List[Dict]:
        """
        Scrape job listings from a specific site.
        Must return a list of dictionaries, each representing a job:
        [
            {
                "title": "Software Engineer",
                "company": "ABC Ltd",
                "location": "Lagos",
                "source": "Indeed",
                "url": "https://..."
            },
            ...
        ]
        """
        pass
