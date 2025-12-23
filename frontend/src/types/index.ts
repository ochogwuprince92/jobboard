// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  address?: string;
  is_employer: boolean;
  is_verified: boolean;
  is_active: boolean;
  date_joined: string;
}

// Auth Types
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  email: string;
  phone_number?: string;  // Optional since we allow either email or phone
  first_name: string;
  last_name: string;
  password: string;       // Updated to match API
  confirm_password: string;  // Updated to match API
  is_employer?: boolean;  // Optional since it's not required for registration
}

// Job Types
export interface Job {
  id: number | string;  // API returns number, but we often use string in URLs/components
  title: string;
  company: Employer;
  company_name?: string;  // For list views where full Employer object isn't needed
  location: string;
  description: string;
  requirements: string;
  salary?: string;  // Formatted salary string for display
  min_salary?: number;
  max_salary?: number;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote?: boolean;  // Whether this is a remote position
  type?: string;     // Legacy/display type field
  posted_by: number;
  tags: JobTag[];
  is_active: boolean;
  posted_at: string;
  postedDate?: string;  // Formatted date for display
  // Additional fields from API/components
  results?: Job[];      // For paginated responses
  employer?: string;    // For filtering
  status?: string;      // For application status
}

export interface JobTag {
  id: number;
  name: string;
}

// Employer Types
export interface Employer {
  id: number;
  user: number;
  company_name: string;
  industry?: string;
  company_size?: string;
  website?: string;
  description?: string;
  location?: string;
  logo?: string;
  created_at: string;
}

// Resume Types
export interface Resume {
  id: number;
  user: number;
  title: string;
  file: string;
  uploaded_at: string;
}

// Application Types
export interface Application {
  id: number;
  job: number;
  applicant: number;
  resume: number;
  cover_letter?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  applicant_name?: string;
  job_title?: string;
  company_name?: string;
}

// Notification Types
export interface Notification {
  id: number;
  user: number;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

// AI Types
export interface ParsedResume {
  email: string;
  phone: string;
  skills: {
    [category: string]: string[];
  };
  all_skills: string[];
  education: string[];
  experience_years: number;
}

export interface ExtractedSkills {
  skills: {
    [category: string]: string[];
  };
  all_skills: string[];
}

export interface JobMatchResult {
  overall_score: number;
  skill_match: number;
  text_similarity: number;
  match_level: string;
  matched_skills: string[];
  missing_skills: string[];
  resume_skills: string[];
  job_skills: string[];
}

export interface JobRecommendation {
  job_id: number;
  job_title: string;
  company: string;
  location: string;
  match_score: number;
  match_level: string;
  matched_skills: string[];
}

export interface RecommendationsResponse {
  recommendations: JobRecommendation[];
}

// Scraper Types
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

// API Error Types
export interface APIError {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
