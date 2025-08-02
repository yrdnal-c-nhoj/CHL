import React from 'react';
import { Link, useRouteError } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {error?.status === 400 ? 'Invalid Date' : '404 - Page Not Found'}
      </h1>
      <p className={styles.message}>
        {error?.statusText || error?.message || (
          <>
            Sorry, the page you're looking for doesn't exist.🧊🫀🔭
          </>
        )}
      </p>
      <Link to="/" className={styles.homeLink}>
        Return to Home
      </Link>
    </div>
  );
};

export default ErrorPage;