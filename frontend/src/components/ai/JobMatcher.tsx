'use client';

import { useState, useEffect } from 'react';
import { matchResumeToJob, JobMatchResult } from '@/api/ai';
import styles from './JobMatcher.module.css';

interface JobMatcherProps {
  jobId: number;
  jobTitle?: string;
  resumeId?: number;
}

export default function JobMatcher({ jobId, jobTitle, resumeId }: JobMatcherProps) {
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMatch = async () => {
    if (!resumeId) {
      setError('Please select a resume first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await matchResumeToJob(jobId, resumeId);
      setMatchResult(result);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to calculate match');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 75) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    if (score >= 25) return '#FFC107';
    return '#F44336';
  };

  const getMatchEmoji = (level: string) => {
    switch (level) {
      case 'Excellent':
        return '🌟';
      case 'Good':
        return '👍';
      case 'Fair':
        return '👌';
      default:
        return '📊';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🎯 Job Match Analysis</h3>
        {jobTitle && <p className={styles.jobTitle}>{jobTitle}</p>}
      </div>

      <button
        className={styles.matchButton}
        onClick={handleMatch}
        disabled={loading || !resumeId}
      >
        {loading ? 'Analyzing...' : 'Calculate Match Score'}
      </button>

      {error && <div className={styles.error}>{error}</div>}

      {matchResult && (
        <div className={styles.results}>
          <div className={styles.scoreSection}>
            <div
              className={styles.overallScore}
              style={{ borderColor: getMatchColor(matchResult.overall_score) }}
            >
              <div className={styles.scoreValue}>
                {matchResult.overall_score}%
              </div>
              <div className={styles.matchLevel}>
                {getMatchEmoji(matchResult.match_level)} {matchResult.match_level} Match
              </div>
            </div>

            <div className={styles.subScores}>
              <div className={styles.subScore}>
                <div className={styles.subScoreLabel}>Skill Match</div>
                <div className={styles.subScoreValue}>{matchResult.skill_match}%</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${matchResult.skill_match}%`,
                      backgroundColor: getMatchColor(matchResult.skill_match),
                    }}
                  />
                </div>
              </div>

              <div className={styles.subScore}>
                <div className={styles.subScoreLabel}>Text Similarity</div>
                <div className={styles.subScoreValue}>{matchResult.text_similarity}%</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${matchResult.text_similarity}%`,
                      backgroundColor: getMatchColor(matchResult.text_similarity),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.skillsSection}>
            <div className={styles.skillsColumn}>
              <h4>✅ Matched Skills ({matchResult.matched_skills.length})</h4>
              <div className={styles.skillsList}>
                {matchResult.matched_skills.length > 0 ? (
                  matchResult.matched_skills.map((skill) => (
                    <span key={skill} className={`${styles.skillTag} ${styles.matched}`}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={styles.noSkills}>No matching skills found</p>
                )}
              </div>
            </div>

            <div className={styles.skillsColumn}>
              <h4>❌ Missing Skills ({matchResult.missing_skills.length})</h4>
              <div className={styles.skillsList}>
                {matchResult.missing_skills.length > 0 ? (
                  matchResult.missing_skills.map((skill) => (
                    <span key={skill} className={`${styles.skillTag} ${styles.missing}`}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={styles.noSkills}>You have all required skills!</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.recommendation}>
            {matchResult.overall_score >= 75 && (
              <p className={styles.excellent}>
                🎉 Excellent match! You should definitely apply for this position.
              </p>
            )}
            {matchResult.overall_score >= 50 && matchResult.overall_score < 75 && (
              <p className={styles.good}>
                👍 Good match! Consider highlighting your relevant experience.
              </p>
            )}
            {matchResult.overall_score >= 25 && matchResult.overall_score < 50 && (
              <p className={styles.fair}>
                📚 Fair match. You may want to acquire some of the missing skills first.
              </p>
            )}
            {matchResult.overall_score < 25 && (
              <p className={styles.poor}>
                💡 This role may require different skills. Keep exploring other opportunities!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
