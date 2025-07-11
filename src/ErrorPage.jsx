import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link to="/" className={styles.homeLink}>
        Return to Home
      </Link>
    </div>
  );
};

export default ErrorPage;