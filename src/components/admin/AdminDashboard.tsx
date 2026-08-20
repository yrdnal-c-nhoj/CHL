import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard =  () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Admin File Directory
        </h1>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <Link to="/admin/tags" className={styles.listLink}>
              Bulk Tag Manager
            </Link>
            <span className={styles.listMeta}>Source: TagManager.tsx</span>
          </li>
          <li className={styles.listItem}>
            <Link to="/admin/tag-by-image" className={styles.listLink}>
              Tag By Image Tool
            </Link>
            <span className={styles.listMeta}>Source: TagByImage.tsx</span>
          </li>
          <li className={styles.listItem}>
            <Link to="/tagger/26-06-01" className={styles.listLink}>
              Individual Tagger
            </Link>
            <span className={styles.listMeta}>Source: Tagger.tsx (Example Date)</span>
          </li>
        </ul>
        <p className={styles.backMargin}>
          <Link to="/" className={styles.backLink}>&larr; Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;