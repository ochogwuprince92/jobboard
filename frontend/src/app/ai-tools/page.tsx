'use client';

import { useState } from 'react';
import Link from 'next/link';
import ResumeParser from '@/components/ai/ResumeParser';
import styles from './page.module.css';

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<'parser' | 'matcher'>('parser');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🤖 AI-Powered Tools</h1>
        <p className={styles.subtitle}>
          Leverage artificial intelligence to enhance your job search experience
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'parser' ? styles.active : ''}`}
          onClick={() => setActiveTab('parser')}
        >
          📄 Resume Parser
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'matcher' ? styles.active : ''}`}
          onClick={() => setActiveTab('matcher')}
        >
          🎯 Job Matcher
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'parser' && (
          <div className={styles.tabContent}>
            <ResumeParser />
          </div>
        )}

        {activeTab === 'matcher' && (
          <div className={styles.tabContent}>
            <div className={styles.comingSoon}>
              <h2>🎯 Job Matcher</h2>
              <p>
                The Job Matcher is available on individual job pages.
                Browse jobs and click &quot;Check Match Score&quot; to see how well your resume matches!
              </p>
              <Link href="/jobs" className={styles.browseButton}>
                Browse Jobs
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className={styles.features}>
        <h2>✨ AI Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📄</div>
            <h3>Resume Parsing</h3>
            <p>
              Automatically extract contact information, skills, education, and experience
              from your resume text
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Skill Extraction</h3>
            <p>
              Identify and categorize technical skills from resumes and job descriptions
              across 60+ common technologies
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Job Matching</h3>
            <p>
              Get detailed match scores showing how well your skills align with job
              requirements
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💡</div>
            <h3>Smart Recommendations</h3>
            <p>
              Receive personalized job recommendations based on your resume and
              experience level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
