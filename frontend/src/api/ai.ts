import axiosClient from "./axiosClient";

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

/**
 * Parse resume text and extract structured information
 */
export const parseResume = async (resumeText: string): Promise<ParsedResume> => {
  const response = await axiosClient.post("/parse-resume/", {
    resume_text: resumeText,
  });
  return response.data;
};

/**
 * Extract skills from text (resume or job description)
 */
export const extractSkills = async (text: string): Promise<ExtractedSkills> => {
  const response = await axiosClient.post("/extract-skills/", {
    text,
  });
  return response.data;
};

/**
 * Calculate match score between resume and job
 */
export const matchResumeToJob = async (
  jobId: number,
  resumeId?: number,
  resumeText?: string
): Promise<JobMatchResult> => {
  const response = await axiosClient.post("/match-resume-job/", {
    job_id: jobId,
    resume_id: resumeId,
    resume_text: resumeText,
  });
  return response.data;
};

/**
 * Get personalized job recommendations based on resume
 */
export const getJobRecommendations = async (
  resumeId: number,
  limit: number = 10
): Promise<RecommendationsResponse> => {
  const response = await axiosClient.get("/job-recommendations/", {
    params: {
      resume_id: resumeId,
      limit,
    },
  });
  return response.data;
};

const aiAPI = {
  parseResume,
  extractSkills,
  matchResumeToJob,
  getJobRecommendations,
};

export default aiAPI;
