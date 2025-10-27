import React, { useEffect, useState } from "react";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CX = import.meta.env.VITE_GOOGLE_CX; // Your Custom Search Engine ID
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
    const timeString = `${hours}${minutes.toString().padStart(2, "0")}`;
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
          `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&searchType=image&q=${encodeURIComponent(query)}&safe=high&num=5`
        );

        if (!response.ok) throw new Error("Google API request failed");

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const randomImg = data.items[Math.floor(Math.random() * data.items.length)];

          setImages(prev => ({
            ...prev,
            [digit]: {
              url: randomImg.link,
              photographer: randomImg.displayLink,
              photographerLink: randomImg.image.contextLink,
              id: randomImg.cacheId || randomImg.link
            }
          }));

          return; // stop searching after first match
        }
      } catch (err) {
        console.error(err);
        setError(`Error fetching image for ${digit}.`);
      }
    }

    // If no image found, leave blank
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
