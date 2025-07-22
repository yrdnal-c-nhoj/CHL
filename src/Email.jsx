import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactForm() {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",      // Replace with your EmailJS Service ID
        "YOUR_TEMPLATE_ID",     // Replace with your EmailJS Template ID
        form.current,
        "YOUR_PUBLIC_USER_ID"   // Replace with your EmailJS Public Key/User ID
      )
      .then(
        () => {
          alert("Message sent!");
          form.current.reset();
          setLoading(false);
        },
        (error) => {
          alert("Oops! Something went wrong. Please try again.");
          console.error(error);
          setLoading(false);
        }
      );
  };

  return (
    <form ref={form} onSubmit={sendEmail} style={formStyle}>
      <input
        type="text"
        name="user_name"
        placeholder="Your name"
        required
        style={inputStyle}
      />
      <input
        type="email"
        name="user_email"
        placeholder="Your email"
        required
        style={inputStyle}
      />
      <textarea
        name="message"
        placeholder="Your message"
        required
        rows={6}
        style={{ ...inputStyle, resize: "vertical" }}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

// Simple inline styles for quick demo
const formStyle = {
  maxWidth: "400px",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.75rem",
  fontSize: "1.1rem",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  cursor: "pointer",
};
