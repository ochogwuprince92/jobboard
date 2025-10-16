# Frontend Setup & AI Integration

## 🎨 Frontend Overview

The Job Board frontend is built with:
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - Latest React version
- **TypeScript 5** - Type-safe development
- **TanStack React Query 5.90.2** - Data fetching and caching
- **Axios 1.12.2** - HTTP client with interceptors
- **React Icons 5.5.0** - Icon library

## ✅ What Was Added

### 1. AI API Client (`src/api/ai.ts`)

Complete TypeScript API client for AI features:

```typescript
// Functions
- parseResume(resumeText: string): Promise<ParsedResume>
- extractSkills(text: string): Promise<ExtractedSkills>
- matchResumeToJob(jobId, resumeId?, resumeText?): Promise<JobMatchResult>
- getJobRecommendations(resumeId, limit): Promise<RecommendationsResponse>
```

**Features:**
- Full TypeScript interfaces for type safety
- Automatic JWT token injection
- Error handling
- Clean async/await API

### 2. Scraper API Client (`src/api/scraper.ts`)

API client for web scraping features:

```typescript
// Functions
- triggerScraping(keyword?, location?, async?): Promise<TriggerScrapingResponse>
- getScrapedJobs(source?): Promise<ScrapedJob[]>
```

### 3. Resume Parser Component

**Location:** `src/components/ai/ResumeParser.tsx`

**Features:**
- Large textarea for resume input
- Real-time parsing with loading states
- Beautiful results display with:
  - Contact information extraction
  - Categorized skills with color-coded tags
  - Education history
  - Experience years
- Responsive design
- Error handling

**Usage:**
```tsx
import ResumeParser from '@/components/ai/ResumeParser';

<ResumeParser />
```

### 4. Job Matcher Component

**Location:** `src/components/ai/JobMatcher.tsx`

**Features:**
- Visual match score display (0-100%)
- Color-coded match levels (Excellent/Good/Fair/Poor)
- Skill match and text similarity breakdown
- Progress bars for sub-scores
- Matched vs missing skills comparison
- Personalized recommendations
- Responsive grid layout

**Usage:**
```tsx
import JobMatcher from '@/components/ai/JobMatcher';

<JobMatcher 
  jobId={123} 
  jobTitle="Senior Python Developer"
  resumeId={456}
/>
```

### 5. AI Tools Page

**Location:** `src/app/ai-tools/page.tsx`

**Features:**
- Tabbed interface for different AI tools
- Resume Parser tab
- Job Matcher information
- Feature showcase grid
- Responsive design
- Modern gradient styling

**Access:** `http://localhost:3000/ai-tools`

## 📁 File Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── ai.ts                    ✨ NEW - AI API client
│   │   ├── scraper.ts               ✨ NEW - Scraper API client
│   │   ├── api.ts                   (existing)
│   │   ├── axiosClient.ts           (existing)
│   │   ├── auth.ts                  (existing)
│   │   ├── jobs.ts                  (existing)
│   │   └── ...
│   ├── components/
│   │   ├── ai/
│   │   │   ├── ResumeParser.tsx     ✨ NEW
│   │   │   ├── ResumeParser.module.css ✨ NEW
│   │   │   ├── JobMatcher.tsx       ✨ NEW
│   │   │   └── JobMatcher.module.css ✨ NEW
│   │   └── ...
│   ├── app/
│   │   ├── ai-tools/
│   │   │   ├── page.tsx             ✨ NEW
│   │   │   └── page.module.css      ✨ NEW
│   │   └── ...
│   └── ...
└── ...
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 4. Access AI Tools

Navigate to: **http://localhost:3000/ai-tools**

## 🎯 Using the AI Features

### Resume Parser

1. Go to `/ai-tools`
2. Click "Resume Parser" tab
3. Paste resume text in the textarea
4. Click "Parse Resume"
5. View extracted information:
   - Email and phone
   - Categorized skills
   - Education
   - Experience years

### Job Matcher

1. Browse to a job details page
2. Select your resume
3. Click "Check Match Score"
4. View:
   - Overall match percentage
   - Skill match breakdown
   - Text similarity score
   - Matched skills (green)
   - Missing skills (red)
   - Personalized recommendation

### Job Recommendations

```typescript
import { getJobRecommendations } from '@/api/ai';

const recommendations = await getJobRecommendations(resumeId, 10);
// Returns top 10 jobs ranked by match score
```

## 🎨 Styling

All components use CSS Modules for scoped styling:

- **Color Scheme:**
  - Primary: `#667eea` (purple-blue)
  - Secondary: `#764ba2` (purple)
  - Success: `#4CAF50` (green)
  - Warning: `#FF9800` (orange)
  - Error: `#F44336` (red)

- **Gradients:**
  - Main: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

- **Responsive:**
  - Mobile-first design
  - Breakpoint: `768px`

## 🔧 Integration Examples

### Add Job Matcher to Job Details Page

```tsx
// src/app/jobs/[id]/page.tsx
import JobMatcher from '@/components/ai/JobMatcher';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [selectedResumeId, setSelectedResumeId] = useState<number>();

  return (
    <div>
      {/* Job details */}
      
      {/* AI Match Score */}
      <JobMatcher 
        jobId={parseInt(params.id)}
        jobTitle={job.title}
        resumeId={selectedResumeId}
      />
    </div>
  );
}
```

### Add Recommendations to Dashboard

```tsx
// src/app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobRecommendations } from '@/api/ai';

export default function Dashboard() {
  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', resumeId],
    queryFn: () => getJobRecommendations(resumeId, 5),
    enabled: !!resumeId,
  });

  return (
    <div>
      <h2>Recommended Jobs</h2>
      {recommendations?.recommendations.map((job) => (
        <div key={job.job_id}>
          <h3>{job.job_title}</h3>
          <p>Match Score: {job.match_score}%</p>
          <p>Skills: {job.matched_skills.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

### Parse Resume on Upload

```tsx
// src/components/ResumeUploader.tsx
import { parseResume } from '@/api/ai';

const handleFileUpload = async (file: File) => {
  const text = await file.text();
  const parsed = await parseResume(text);
  
  // Auto-fill form with parsed data
  setEmail(parsed.email);
  setPhone(parsed.phone);
  setSkills(parsed.all_skills);
};
```

## 📊 TypeScript Interfaces

### ParsedResume
```typescript
interface ParsedResume {
  email: string;
  phone: string;
  skills: { [category: string]: string[] };
  all_skills: string[];
  education: string[];
  experience_years: number;
}
```

### JobMatchResult
```typescript
interface JobMatchResult {
  overall_score: number;
  skill_match: number;
  text_similarity: number;
  match_level: string;
  matched_skills: string[];
  missing_skills: string[];
  resume_skills: string[];
  job_skills: string[];
}
```

### JobRecommendation
```typescript
interface JobRecommendation {
  job_id: number;
  job_title: string;
  company: string;
  location: string;
  match_score: number;
  match_level: string;
  matched_skills: string[];
}
```

## 🧪 Testing

### Manual Testing

1. **Resume Parser:**
   - Test with various resume formats
   - Verify skill extraction accuracy
   - Check contact information parsing

2. **Job Matcher:**
   - Test with different job-resume combinations
   - Verify score calculations
   - Check skill categorization

3. **Recommendations:**
   - Test with different resumes
   - Verify ranking order
   - Check match score accuracy

### Example Test Data

```typescript
const testResume = `
John Doe
john@example.com
+1234567890

Senior Software Engineer with 7 years of experience.

Skills:
- Python, Django, Flask
- JavaScript, React, Node.js
- PostgreSQL, MongoDB
- AWS, Docker, Kubernetes
- Machine Learning, TensorFlow

Education:
Bachelor of Science in Computer Science
Stanford University
`;
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Production `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🎯 Next Steps

### Recommended Enhancements

1. **Add to Navigation:**
   - Add "AI Tools" link to main navigation
   - Add icon badge for new feature

2. **Dashboard Integration:**
   - Show job recommendations on dashboard
   - Display match scores on job cards
   - Add "Parse Resume" button to resume upload

3. **Job Details Enhancement:**
   - Add JobMatcher component to job pages
   - Show match score badge on job cards
   - Add "Similar Jobs" based on AI

4. **Analytics:**
   - Track AI feature usage
   - Monitor match score distributions
   - Analyze recommendation accuracy

5. **UX Improvements:**
   - Add tooltips explaining match scores
   - Add tutorial/onboarding for AI features
   - Add loading skeletons
   - Add success animations

## 📝 Notes

- All AI features work with the existing authentication system
- JWT tokens are automatically included in requests
- Error handling is built into all components
- Components are fully responsive
- TypeScript provides full type safety
- CSS Modules prevent style conflicts

## 🆘 Troubleshooting

### API Connection Issues

```typescript
// Check API URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Test connection
const response = await fetch('http://localhost:8000/api/schema/');
console.log(await response.json());
```

### CORS Errors

Make sure backend `CORS_ALLOWED_ORIGINS` includes:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Rebuild
rm -rf .next
npm run dev
```

## ✨ Summary

Successfully integrated:
- ✅ Complete AI API client with TypeScript
- ✅ Resume Parser component with beautiful UI
- ✅ Job Matcher component with visual scoring
- ✅ AI Tools page with tabbed interface
- ✅ Scraper API client
- ✅ Full type safety with TypeScript interfaces
- ✅ Responsive design for all screen sizes
- ✅ Modern gradient styling
- ✅ Error handling and loading states

The frontend is now ready to showcase all AI-powered features! 🚀
