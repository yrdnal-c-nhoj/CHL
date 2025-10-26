import React, { useEffect, useState } from "react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;

const TimeDigitGallery = () => {
  const [currentDigits, setCurrentDigits] = useState([]);
  const [images, setImages] = useState({});
  const [error, setError] = useState("");

  const getTimeDigits = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;
    
    // Format without leading zeros
    const timeString = `${hours}${minutes.toString().padStart(2, '0')}`;
    
    // Split into individual digits
    return timeString.split('').map(Number);
  };

  const fetchDigitImage = async (digit) => {
    // Don't fetch if we already have an image for this digit
    if (images[digit]) return;
    
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${digit}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (!response.ok) throw new Error("Unsplash request failed");
      const data = await response.json();
      if (data.results.length > 0) {
        const randomPhoto =
          data.results[Math.floor(Math.random() * data.results.length)];
        setImages((prev) => ({
          ...prev,
          [digit]: {
            url: randomPhoto.urls.regular,
            photographer: randomPhoto.user.name,
            photographerLink: randomPhoto.user.links.html,
            id: randomPhoto.id,
          },
        }));
        // Trigger download endpoint
        fetch(
          `https://api.unsplash.com/photos/${randomPhoto.id}/download?client_id=${UNSPLASH_ACCESS_KEY}`
        ).catch((err) => console.error("Download tracking failed:", err));
      }
    } catch (err) {
      console.error(err);
      setError(`Error fetching image for ${digit}.`);
    }
  };

  useEffect(() => {
    // Initial load
    const digits = getTimeDigits();
    setCurrentDigits(digits);
    digits.forEach((digit) => fetchDigitImage(digit));

    // Update every minute
    const interval = setInterval(() => {
      const newDigits = getTimeDigits();
      setCurrentDigits(newDigits);
      newDigits.forEach((digit) => fetchDigitImage(digit));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#111",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "4vh",
    padding: "2vh",
    color: "white",
    fontFamily: "sans-serif",
    textAlign: "center",
  };

  const timeContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "2vh",
  };

  const digitStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "25vh",
  };

  const imageStyle = {
    height: "20vh",
    width: "auto",
    borderRadius: "2vh",
    boxShadow: "0 0 3vh rgba(0,0,0,0.5)",
    objectFit: "cover",
    transition: "opacity 1s ease-in-out",
    opacity: 1,
  };

  const titleStyle = {
    fontSize: "5vh",
    marginBottom: "1vh",
    letterSpacing: "0.2vh",
  };

  const attributionStyle = {
    fontSize: "2vh",
    marginTop: "0.5vh",
    color: "#ccc",
    textDecoration: "none",
  };

  const headerStyle = {
    fontSize: "3vh",
    color: "#888",
    marginBottom: "2vh",
  };

  return (
    <div style={containerStyle}>
       <div style={timeContainerStyle}>
        {currentDigits.map((digit, index) => (
          <div key={`${digit}-${index}`} style={digitStyle}>
            <div style={titleStyle}>{digit}</div>
            {images[digit] ? (
              <>
                <img
                  src={images[digit].url}
                  alt={`Random image for digit ${digit}`}
                  style={imageStyle}
                />
                <a
                  href={images[digit].photographerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={attributionStyle}
                >
                  Photo by {images[digit].photographer}
                </a>
              </>
            ) : (
              <div style={{ fontSize: "2.5vh" }}>Loading...</div>
            )}
          </div>
        ))}
      </div>
      {error && <div style={{ fontSize: "2.5vh", color: "#f55" }}>{error}</div>}
    </div>
  );
};

export default TimeDigitGallery;