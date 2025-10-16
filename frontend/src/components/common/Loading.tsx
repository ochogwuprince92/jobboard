import styles from './Loading.module.css';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export default function Loading({ fullScreen = false, message = 'Loading...' }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
