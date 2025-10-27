import React, { useEffect, useState } from "react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const digitWords = ["zero","one","two","three","four","five","six","seven","eight","nine"];

const TimeDigitGallery = () => {
  const [currentDigits, setCurrentDigits] = useState([]);
  const [images, setImages] = useState({});
  const [error, setError] = useState("");

  const getTimeDigits = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    
    hours = hours % 12 || 12;
    const timeString = `${hours}${minutes.toString().padStart(2, '0')}`;
    return timeString.split("").map(Number);
  };

  const fetchDigitImage = async (digit) => {
    if (images[digit]) return;

    const queries = [
      `${digit} single digit illustration`,
      `${digit} isolated number typography`,
      `${digit} solo graphic`,
      `${digitWords[digit]} single illustration`,
      `${digitWords[digit]} isolated typography`,
      `${digitWords[digit]} solo graphic`
    ];

    for (const query of queries) {
      try {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        if (!response.ok) throw new Error("Unsplash request failed");

        const data = await response.json();

        const filteredResults = data.results.filter(photo => {
          const desc = (photo.description || photo.alt_description || "").toLowerCase();
          return !desc.match(/\d{2,}/); // exclude multiple digits
        });

        if (filteredResults.length > 0) {
          const randomPhoto = filteredResults[Math.floor(Math.random() * filteredResults.length)];
          setImages(prev => ({
            ...prev,
            [digit]: {
              url: randomPhoto.urls.regular,
              photographer: randomPhoto.user.name,
              photographerLink: randomPhoto.user.links.html,
              id: randomPhoto.id
            }
          }));

          fetch(
            `https://api.unsplash.com/photos/${randomPhoto.id}/download?client_id=${UNSPLASH_ACCESS_KEY}`
          ).catch(err => console.error("Download tracking failed:", err));

          return; // stop after finding one
        }
      } catch (err) {
        console.error(err);
        setError(`Error fetching image for ${digit}.`);
      }
    }

    // If no image found, leave it blank (no fallback)
    setImages(prev => ({
      ...prev,
      [digit]: null
    }));
  };

  useEffect(() => {
    const digits = getTimeDigits();
    setCurrentDigits(digits);
    digits.forEach(fetchDigitImage);

    const interval = setInterval(() => {
      const newDigits = getTimeDigits();
      setCurrentDigits(newDigits);
      newDigits.forEach(fetchDigitImage);
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
                  alt={`Digit ${digit}`}
                  style={imageStyle}
                />
                <a
                  href={images[digit].photographerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={attributionStyle}
                >
                  {images[digit].photographer}
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
