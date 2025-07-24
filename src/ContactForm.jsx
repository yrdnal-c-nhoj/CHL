// ContactForm.jsx
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_22mck9l',     // Replace with your actual service ID
      'template_q5d1j6q',    // Replace with your actual template ID
      form.current,
      '8pV1DN6kZkdOvnJom'     // Replace with your actual public key
    )
    .then(
      (result) => {
        console.log('Success:', result.text);
        alert('Message sent!');
      },
      (error) => {
        console.error('Error:', error.text);
        alert('Failed to send message.');
      }
    );
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <input type="text" name="user_name" placeholder="Your Name" required />
      <input type="email" name="user_email" placeholder="Your Email" required />
      <textarea name="message" placeholder="Your Message" required />
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
