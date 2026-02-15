import React, { useEffect, useState } from 'react';

const WordClock = () => {
  const [time, setTime] = useState(new Date());
  const [activeClasses, setActiveClasses] = useState(new Set(['it', 'is']));
  const [isInitialized, setIsInitialized] = useState(false);

  // Word matrix structure
  const wordMatrix = [
    { letters: ['I', 'T', 'E', 'I', 'S', 'F', 'A', 'L', 'V', 'N', 'E'], classes: ['it', 'it', '', 'is', 'is', '', 'a', '', '', '', ''] },
    { letters: ['J', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'C', 'K', 'O'], classes: ['', 'quarter', 'quarter', 'quarter', 'quarter', 'quarter', 'quarter', 'quarter', '', '', ''] },
    { letters: ['T', 'W', 'E', 'N', 'T', 'Y', 'X', 'F', 'I', 'V', 'E'], classes: ['twenty', 'twenty', 'twenty', 'twenty', 'twenty', 'twenty', '', 'five', 'five', 'five', 'five'] },
    { letters: ['H', 'A', 'L', 'F', 'C', 'T', 'E', 'N', 'G', 'T', 'O'], classes: ['half', 'half', 'half', 'half', '', 'ten', 'ten', 'ten', '', 'to', 'to'] },
    { letters: ['P', 'A', 'S', 'T', 'B', 'S', 'E', 'V', 'E', 'N', 'L'], classes: ['past', 'past', 'past', 'past', '', '7', '7', '7', '7', '7', ''] },
    { letters: ['O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E'], classes: ['1', '1', '1', '2', '2', '2', '3', '3', '3', '3', '3'] },
    { letters: ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'S', 'I', 'X'], classes: ['4', '4', '4', '4', '5', '5', '5', '5', '6', '6', '6'] },
    { letters: ['N', 'I', 'N', 'E', 'K', 'T', 'W', 'E', 'L', 'V', 'E'], classes: ['9', '9', '9', '9', '', '12', '12', '12', '12', '12', '12'] },
    { letters: ['E', 'I', 'G', 'H', 'T', 'E', 'L', 'E', 'V', 'E', 'N'], classes: ['8', '8', '8', '8', '8', '11', '11', '11', '11', '11', '11'] },
    { letters: ['T', 'E', 'N', 'P', 'Y', 'O', 'C', 'L', 'O', 'C', 'K'], classes: ['10', '10', '10', '', '', 'oclock', 'oclock', 'oclock', 'oclock', 'oclock', 'oclock'] }
  ];

  useEffect(() => {
    const updateTime = () => {
      const currentTime = new Date();
      setTime(currentTime);
      
      const hour = currentTime.getHours() >= 12 ? currentTime.getHours() - 12 : currentTime.getHours();
      const minute = currentTime.getMinutes();
      
      const newActiveClasses = new Set(['it', 'is']);
      
      // Time logic
      if (minute >= 58) {
        // On the hour
        newActiveClasses.add('oclock');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 52) {
        // Five to
        newActiveClasses.add('five');
        newActiveClasses.add('to');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 49) {
        // Ten to
        newActiveClasses.add('ten');
        newActiveClasses.add('to');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 45) {
        // Quarter to
        newActiveClasses.add('quarter');
        newActiveClasses.add('to');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 42) {
        // Twenty to
        newActiveClasses.add('twenty');
        newActiveClasses.add('to');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 37) {
        // Twenty five to
        newActiveClasses.add('twenty');
        newActiveClasses.add('five');
        newActiveClasses.add('to');
        newActiveClasses.add((hour + 1).toString());
      } else if (minute >= 32) {
        // Half past
        newActiveClasses.add('half');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 27) {
        // Twenty five past
        newActiveClasses.add('twenty');
        newActiveClasses.add('five');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 22) {
        // Twenty past
        newActiveClasses.add('twenty');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 17) {
        // Quarter past
        newActiveClasses.add('quarter');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 12) {
        // Ten past
        newActiveClasses.add('ten');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 7) {
        // Five past
        newActiveClasses.add('five');
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else if (minute >= 2) {
        // Past (but not five)
        newActiveClasses.add('past');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      } else {
        // On the hour
        newActiveClasses.add('oclock');
        newActiveClasses.add((hour === 0 ? 12 : hour).toString());
      }
      
      setActiveClasses(newActiveClasses);
    };

    // Initial update
    updateTime();
    setIsInitialized(true);
    
    // Update every minute
    const interval = setInterval(updateTime, 60000);
    
    // Update after remaining seconds to next minute
    const secondsToNextMinute = 60 - new Date().getSeconds();
    const timeout = setTimeout(() => {
      updateTime();
      // Then set up the minute interval
    }, secondsToNextMinute * 1000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Single font size variable for all text
  const baseFontSize = 'clamp(2vw, 4vh, 24px)';
  const styles = {
    container: {
      backgroundColor: '#E89077',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Monda', Arial, sans-serif",
      padding: '2vh 2vw',
      boxSizing: 'border-box'
    },
    clockContainer: {
      width: '90vw',
      maxWidth: '660px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    row: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    letter: {
      width: 'clamp(4vw, 8vh, 60px)',
      height: 'clamp(4vw, 8vh, 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#787B78',
      fontFamily: "'Cinzel Decorative', cursive",
      fontWeight: 700,
      fontSize: baseFontSize,
      lineHeight: 'clamp(4vw, 8vh, 60px)',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },
    active: {
      color: '#ff333f',
      fontFamily: "'Cinzel Decorative', cursive",
      // fontFamily: "'Nanum Pen Script', cursive",
      fontWeight: 800,
      fontSize: `calc(${baseFontSize} * 1.4)`, // 30% bigger for highlighted text
      textShadow: '0 0 12px #EDD6EF'
    }
  };

  return (
    <div style={styles.container}>
      {!isInitialized ? (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#ACAEAC',
          fontSize: baseFontSize
        }}>
          Loading...
        </div>
      ) : (
        <>
        <style>{
        `@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Nanum+Pen+Script&display=swap');
        
        // @media (max-width: 768px) {
        //   .clock-letter {
        //     width: clamp(3.5vw, 7vh, 40px) !important;
        //     height: clamp(3.5vw, 7vh, 40px) !important;
        //     font-size: clamp(1.5vw, 3vh, 18px) !important;
        //     line-height: clamp(3.5vw, 7vh, 40px) !important;
        //   }
        // }
        
        // @media (max-width: 480px) {
        //   .clock-letter {
        //     width: clamp(2.5vw, 5vh, 30px) !important;
        //     height: clamp(2.5vw, 5vh, 30px) !important;
        //     font-size: clamp(1.2vw, 4.5vh, 24px) !important;
        //     line-height: clamp(2.5vw, 5vh, 30px) !important;
        //   }
        // }`
      }</style>
      <div style={styles.clockContainer}>
        {wordMatrix.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.letters.map((letter, letterIndex) => {
              const letterClass = row.classes[letterIndex];
              const isActive = activeClasses.has(letterClass);
              
              return (
                <div
                  key={`${rowIndex}-${letterIndex}`}
                  className="clock-letter"
                  style={{
                    ...styles.letter,
                    ...(isActive && styles.active)
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default WordClock;
