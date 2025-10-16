'use client';

import { useState } from 'react';
import { parseResume, ParsedResume } from '@/api/ai';
import styles from './ResumeParser.module.css';

export default function ResumeParser() {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!resumeText.trim()) {
      setError('Please enter resume text');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await parseResume(resumeText);
      setParsedData(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to parse resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🤖 AI Resume Parser</h2>
      <p className={styles.description}>
        Paste your resume text below and our AI will extract structured information
      </p>

      <div className={styles.inputSection}>
        <textarea
          className={styles.textarea}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here...&#10;&#10;Example:&#10;John Doe&#10;john@example.com&#10;+1234567890&#10;&#10;Senior Software Engineer with 5 years of experience in Python, Django, React...&#10;&#10;Skills: Python, Django, PostgreSQL, React, AWS..."
          rows={12}
        />
        
        <button
          className={styles.parseButton}
          onClick={handleParse}
          disabled={loading}
        >
          {loading ? 'Parsing...' : 'Parse Resume'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {parsedData && (
        <div className={styles.results}>
          <h3>Parsed Information</h3>

          <div className={styles.section}>
            <h4>📧 Contact Information</h4>
            <div className={styles.info}>
              <p><strong>Email:</strong> {parsedData.email || 'Not found'}</p>
              <p><strong>Phone:</strong> {parsedData.phone || 'Not found'}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h4>💼 Skills ({parsedData.all_skills.length} found)</h4>
            {Object.entries(parsedData.skills).map(([category, skills]) => (
              <div key={category} className={styles.skillCategory}>
                <strong>{category.replace(/_/g, ' ').toUpperCase()}:</strong>
                <div className={styles.skillTags}>
                  {skills.map((skill) => (
                    <span key={skill} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h4>🎓 Education</h4>
            {parsedData.education.length > 0 ? (
              <ul>
                {parsedData.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            ) : (
              <p>No education information found</p>
            )}
          </div>

          <div className={styles.section}>
            <h4>📅 Experience</h4>
            <p>
              <strong>{parsedData.experience_years}</strong> years of experience detected
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
