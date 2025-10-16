"""
AI Services for resume parsing, skill extraction, and job matching
"""
import re
from typing import List, Dict, Tuple
from collections import Counter


class SkillExtractor:
    """Extract skills from text using keyword matching"""
    
    # Common tech skills database
    TECH_SKILLS = {
        'programming_languages': [
            'python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'swift',
            'kotlin', 'go', 'rust', 'typescript', 'scala', 'r', 'matlab'
        ],
        'web_frameworks': [
            'django', 'flask', 'fastapi', 'react', 'angular', 'vue', 'nodejs',
            'express', 'spring', 'laravel', 'rails', 'asp.net'
        ],
        'databases': [
            'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
            'cassandra', 'dynamodb', 'oracle', 'sql server', 'sqlite'
        ],
        'cloud_devops': [
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab',
            'github actions', 'terraform', 'ansible', 'ci/cd'
        ],
        'data_science': [
            'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'scikit-learn', 'pandas', 'numpy', 'data analysis', 'nlp'
        ],
        'soft_skills': [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'project management', 'agile', 'scrum'
        ]
    }
    
    @classmethod
    def extract_skills(cls, text: str) -> Dict[str, List[str]]:
        """
        Extract skills from text
        
        Args:
            text: Resume or job description text
            
        Returns:
            Dictionary of skill categories and found skills
        """
        text_lower = text.lower()
        found_skills = {}
        
        for category, skills in cls.TECH_SKILLS.items():
            found = []
            for skill in skills:
                if skill in text_lower:
                    found.append(skill)
            if found:
                found_skills[category] = found
        
        return found_skills
    
    @classmethod
    def get_all_skills_flat(cls, text: str) -> List[str]:
        """Get all skills as a flat list"""
        skills_dict = cls.extract_skills(text)
        all_skills = []
        for skills in skills_dict.values():
            all_skills.extend(skills)
        return all_skills


class ResumeParser:
    """Parse resume text to extract structured information"""
    
    @staticmethod
    def extract_email(text: str) -> str:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        match = re.search(email_pattern, text)
        return match.group(0) if match else ""
    
    @staticmethod
    def extract_phone(text: str) -> str:
        """Extract phone number from text"""
        phone_pattern = r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]'
        match = re.search(phone_pattern, text)
        return match.group(0) if match else ""
    
    @staticmethod
    def extract_education(text: str) -> List[str]:
        """Extract education information"""
        education_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.s.', 'm.s.',
            'b.a.', 'm.a.', 'university', 'college', 'degree'
        ]
        
        lines = text.lower().split('\n')
        education = []
        
        for line in lines:
            if any(keyword in line for keyword in education_keywords):
                education.append(line.strip())
        
        return education[:5]  # Return top 5 education entries
    
    @staticmethod
    def extract_experience_years(text: str) -> int:
        """Estimate years of experience from text"""
        # Look for patterns like "5 years", "5+ years", "5-7 years"
        pattern = r'(\d+)[\+\-\s]*(?:years?|yrs?)'
        matches = re.findall(pattern, text.lower())
        
        if matches:
            years = [int(m) for m in matches]
            return max(years)  # Return the highest mentioned
        
        return 0
    
    @classmethod
    def parse_resume(cls, text: str) -> Dict:
        """
        Parse resume text and extract structured information
        
        Args:
            text: Resume text content
            
        Returns:
            Dictionary with parsed resume data
        """
        return {
            'email': cls.extract_email(text),
            'phone': cls.extract_phone(text),
            'skills': SkillExtractor.extract_skills(text),
            'all_skills': SkillExtractor.get_all_skills_flat(text),
            'education': cls.extract_education(text),
            'experience_years': cls.extract_experience_years(text)
        }


class JobMatcher:
    """Match resumes with jobs based on skills and requirements"""
    
    @staticmethod
    def calculate_skill_match(resume_skills: List[str], job_skills: List[str]) -> float:
        """
        Calculate skill match percentage between resume and job
        
        Args:
            resume_skills: List of skills from resume
            job_skills: List of required skills from job
            
        Returns:
            Match percentage (0-100)
        """
        if not job_skills:
            return 0.0
        
        resume_skills_lower = [s.lower() for s in resume_skills]
        job_skills_lower = [s.lower() for s in job_skills]
        
        matched_skills = set(resume_skills_lower) & set(job_skills_lower)
        match_percentage = (len(matched_skills) / len(job_skills_lower)) * 100
        
        return round(match_percentage, 2)
    
    @staticmethod
    def calculate_text_similarity(text1: str, text2: str) -> float:
        """
        Calculate simple text similarity using word overlap
        
        Args:
            text1: First text (e.g., resume)
            text2: Second text (e.g., job description)
            
        Returns:
            Similarity score (0-100)
        """
        # Tokenize and clean
        words1 = set(re.findall(r'\w+', text1.lower()))
        words2 = set(re.findall(r'\w+', text2.lower()))
        
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        words1 = words1 - stop_words
        words2 = words2 - stop_words
        
        if not words1 or not words2:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = len(words1 & words2)
        union = len(words1 | words2)
        
        similarity = (intersection / union) * 100 if union > 0 else 0
        return round(similarity, 2)
    
    @classmethod
    def match_resume_to_job(cls, resume_text: str, job_description: str, 
                           job_requirements: str = "") -> Dict:
        """
        Match a resume to a job posting
        
        Args:
            resume_text: Full resume text
            job_description: Job description text
            job_requirements: Job requirements text
            
        Returns:
            Dictionary with match score and details
        """
        # Parse resume
        resume_data = ResumeParser.parse_resume(resume_text)
        
        # Extract job skills
        job_text = f"{job_description} {job_requirements}"
        job_skills = SkillExtractor.get_all_skills_flat(job_text)
        
        # Calculate matches
        skill_match = cls.calculate_skill_match(resume_data['all_skills'], job_skills)
        text_similarity = cls.calculate_text_similarity(resume_text, job_text)
        
        # Calculate overall match score (weighted average)
        overall_score = (skill_match * 0.6) + (text_similarity * 0.4)
        
        # Determine match level
        if overall_score >= 75:
            match_level = "Excellent"
        elif overall_score >= 50:
            match_level = "Good"
        elif overall_score >= 25:
            match_level = "Fair"
        else:
            match_level = "Poor"
        
        return {
            'overall_score': round(overall_score, 2),
            'skill_match': skill_match,
            'text_similarity': text_similarity,
            'match_level': match_level,
            'matched_skills': list(set(resume_data['all_skills']) & set(job_skills)),
            'missing_skills': list(set(job_skills) - set(resume_data['all_skills'])),
            'resume_skills': resume_data['all_skills'],
            'job_skills': job_skills
        }
    
    @classmethod
    def rank_candidates(cls, candidates: List[Tuple[int, str]], 
                       job_description: str, job_requirements: str = "") -> List[Dict]:
        """
        Rank multiple candidates for a job
        
        Args:
            candidates: List of tuples (candidate_id, resume_text)
            job_description: Job description
            job_requirements: Job requirements
            
        Returns:
            List of candidates sorted by match score
        """
        ranked = []
        
        for candidate_id, resume_text in candidates:
            match_result = cls.match_resume_to_job(
                resume_text, job_description, job_requirements
            )
            ranked.append({
                'candidate_id': candidate_id,
                'match_score': match_result['overall_score'],
                'match_level': match_result['match_level'],
                'matched_skills': match_result['matched_skills'],
                'missing_skills': match_result['missing_skills']
            })
        
        # Sort by match score descending
        ranked.sort(key=lambda x: x['match_score'], reverse=True)
        
        return ranked
