"""
Configuration for external job sites and default search.
"""

DEFAULT_SEARCH = {
    "keyword": "developer",
    "location": "Lagos"
}

JOB_SITES = {
    "jobberman": {
        "base_url": "https://www.jobberman.com/jobs",
        "query_param": "q",
        "location_param": "l",
        "pagination_param": "page",
        "enabled": True
    },
    "linkedin": {
        "base_url": "https://www.linkedin.com/jobs/search/",
        "query_param": "keywords",
        "location_param": "location",
        "pagination_param": "start",
        "enabled": False
    },
    "indeed": {
        "base_url": "https://www.indeed.com/jobs",
        "query_param": "q",
        "location_param": "l",
        "pagination_param": "start",
        "enabled": False
    },
    "glassdoor": {
        "base_url": "https://www.glassdoor.com/Job/jobs.htm",
        "selectors": {
            "job_card": "li.react-job-listing",
            "title": ".jobLink",
            "company": ".jobEmployerName",
            "location": ".subtle.loc",
            "url": ".jobLink"
        },
        "enabled": False
    }
}
