import React from 'react';
import { Link } from 'react-router-dom';
// import styles from '../../styles/Tagger.module.css'; // Temporarily removed for debugging

const AdminDashboard: React.FC = () => {
  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#f7f7f7'
    }}>
      <div style={{
        width: 'min(980px,100%)',
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 6px 22px rgba(0,0,0,0.04)'
      }}>
        <h1 style={{
          fontSize: '1.4rem',
          borderBottom: '2px solid #eee',
          paddingBottom: '10px',
          marginBottom: '20px',
          margin: 0, // Reset margin from default h1
          fontWeight: 800, // From Tagger.module.css .title
          letterSpacing: '0.02em', // From Tagger.module.css .title
          color: '#222' // From previous inline style
        }}>
          Admin File Directory
        </h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '15px 0', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
            <Link to="/admin/tags" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>
              Bulk Tag Manager
            </Link>
            <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace', display: 'block', marginTop: '4px' }}>Source: TagManager.tsx</span>
          </li>
          <li style={{ margin: '15px 0', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
            <Link to="/admin/tag-by-image" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>
              Tag By Image Tool
            </Link>
            <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace', display: 'block', marginTop: '4px' }}>Source: TagByImage.tsx</span>
          </li>
          <li style={{ margin: '15px 0', padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#fff' }}>
            <Link to="/tagger/26-06-01" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem', display: 'block' }}>
              Individual Tagger
            </Link>
            <span style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace', display: 'block', marginTop: '4px' }}>Source: Tagger.tsx (Example Date)</span>
          </li>
        </ul>
        <p style={{ marginTop: '30px' }}><Link to="/" style={{ color: '#666', fontSize: '0.9rem' }}>&larr; Back to Home</Link></p>
      </div>
    </div>
  );
};

export default AdminDashboard;