import axiosClient from "./axiosClient";

export interface ScrapedJob {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  job_url: string;
  posted_date: string | null;
  source_website: string | null;
  created_at: string;
  updated_at: string;
}

export interface TriggerScrapingResponse {
  message: string;
  jobs_found?: number;
  jobs_saved?: number;
  task_id?: string;
}

/**
 * Trigger job scraping (admin only)
 */
export const triggerScraping = async (
  keyword?: string,
  location?: string,
  async: boolean = false
): Promise<TriggerScrapingResponse> => {
  const params: Record<string, string> = {};
  if (keyword) params.keyword = keyword;
  if (location) params.location = location;
  if (async) params.async = "true";

  const response = await axiosClient.post("/scrape/", null, { params });
  return response.data;
};

/**
 * Get list of scraped jobs
 */
export const getScrapedJobs = async (source?: string): Promise<ScrapedJob[]> => {
  const params: Record<string, string> = {};
  if (source) params.source = source;

  const response = await axiosClient.get("/scraped-jobs/", { params });
  return response.data;
};

const scraperAPI = {
  triggerScraping,
  getScrapedJobs,
};

export default scraperAPI;
