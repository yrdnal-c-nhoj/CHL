import React, { useState } from 'react';
import './Wordpages.css';

const EmailForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="text">
      <div
        style={{
          padding: '0rem',
          maxWidth: '600px',
          margin: '0 auto',
          fontSize: '0.7rem',
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        {submitted && <p style={{ color: 'green' }}>🧊🫀🔭</p>}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{
              fontFamily: "'Nunito', sans-serif",
              padding: '0.5rem',
              fontSize: '1rem',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              fontFamily: "'Nunito', sans-serif",
              padding: '0.5rem',
              fontSize: '1rem',
            }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
            style={{
              fontFamily: "'Nunito', sans-serif",
              padding: '0.5rem',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              fontFamily: "'Nunito', sans-serif",
              padding: '0.75rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailForm;
