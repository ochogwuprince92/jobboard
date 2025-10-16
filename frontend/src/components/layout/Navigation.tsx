'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>💼</span>
          <span className={styles.logoText}>JobBoard</span>
        </Link>

        <div className={styles.links}>
          <Link 
            href="/jobs" 
            className={`${styles.link} ${isActive('/jobs') ? styles.active : ''}`}
          >
            Browse Jobs
          </Link>

          {isAuthenticated && (
            <>
              <Link 
                href="/dashboard" 
                className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}
              >
                Dashboard
              </Link>

              {!user?.is_employer && (
                <>
                  <Link 
                    href="/resumes" 
                    className={`${styles.link} ${isActive('/resumes') ? styles.active : ''}`}
                  >
                    My Resumes
                  </Link>
                  <Link 
                    href="/ai-tools" 
                    className={`${styles.link} ${styles.aiLink} ${isActive('/ai-tools') ? styles.active : ''}`}
                  >
                    🤖 AI Tools
                  </Link>
                </>
              )}

              {user?.is_employer && (
                <Link 
                  href="/jobs/create" 
                  className={`${styles.link} ${isActive('/jobs/create') ? styles.active : ''}`}
                >
                  Post Job
                </Link>
              )}
            </>
          )}
        </div>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className={styles.profileLink}>
                <span className={styles.userIcon}>👤</span>
                <span>{user?.first_name}</span>
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
