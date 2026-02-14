import React, { useEffect, useState } from 'react';

const WordClock = () => {
  const [activeClasses, setActiveClasses] = useState(new Set(['its', 'active']));

  // Word clock data structure matching HTML
  const wordRows = [
    [
      { letter: 'e', classes: ['its', 'active'] },
      { letter: 's', classes: ['its', 'active'] },
      { letter: 't', classes: ['its', 'active'] },
      { letter: 'a', classes: ['its', 'active'] },
      { letter: 's', classes: ['its', 'active'] },
      { letter: 'r', classes: [] },
      { letter: 'a', classes: ['about'] },
      { letter: 'b', classes: ['about'] },
      { letter: 'o', classes: ['about'] },
      { letter: 'u', classes: ['about'] },
      { letter: 't', classes: ['about'] },
      { letter: 's', classes: [] },
      { letter: 'a', classes: ['a'] }
    ],
    [
      { letter: 't', classes: ['ten'] },
      { letter: 'e', classes: ['ten'] },
      { letter: 'n', classes: ['ten'] },
      { letter: 'q', classes: ['quarter'] },
      { letter: 'u', classes: ['quarter'] },
      { letter: 'a', classes: ['quarter'] },
      { letter: 'r', classes: ['quarter'] },
      { letter: 't', classes: ['quarter'] },
      { letter: 'e', classes: ['quarter'] },
      { letter: 'r', classes: ['quarter'] },
      { letter: 'c', classes: [] }
    ],
    [
      { letter: 'f', classes: ['five'] },
      { letter: 'i', classes: ['five'] },
      { letter: 'v', classes: ['five'] },
      { letter: 'e', classes: ['five'] },
      { letter: 'v', classes: [] },
      { letter: 't', classes: ['twenty'] },
      { letter: 'w', classes: ['twenty'] },
      { letter: 'e', classes: ['twenty'] },
      { letter: 'n', classes: ['twenty'] },
      { letter: 't', classes: ['twenty'] },
      { letter: 'y', classes: ['twenty'] }
    ],
    [
      { letter: 's', classes: [] },
      { letter: 'c', classes: [] },
      { letter: 't', classes: ['thirty'] },
      { letter: 'h', classes: ['thirty'] },
      { letter: 'i', classes: ['thirty'] },
      { letter: 'r', classes: ['thirty'] },
      { letter: 't', classes: ['thirty'] },
      { letter: 'y', classes: ['thirty'] },
      { letter: 'w', classes: [] },
      { letter: 'k', classes: [] },
      { letter: 'r', classes: [] }
    ],
    [
      { letter: 'm', classes: ['minutes'] },
      { letter: 'i', classes: ['minutes'] },
      { letter: 'n', classes: ['minutes'] },
      { letter: 'u', classes: ['minutes'] },
      { letter: 't', classes: ['minutes'] },
      { letter: 'e', classes: ['minutes'] },
      { letter: 's', classes: ['minutes'] },
      { letter: 'j', classes: [] },
      { letter: 't', classes: ['to'] },
      { letter: 'o', classes: ['to'] },
      { letter: 'p', classes: [] }
    ],
    [
      { letter: 'a', classes: ['after'] },
      { letter: 'f', classes: ['after'] },
      { letter: 't', classes: ['after'] },
      { letter: 'e', classes: ['after'] },
      { letter: 'r', classes: ['after'] },
      { letter: 'c', classes: [] },
      { letter: 's', classes: ['_7'] },
      { letter: 'e', classes: ['_7'] },
      { letter: 'v', classes: ['_7'] },
      { letter: 'e', classes: ['_7'] },
      { letter: 'n', classes: ['_7'] }
    ],
    [
      { letter: 'o', classes: ['_1'] },
      { letter: 'n', classes: ['_1'] },
      { letter: 'e', classes: ['_1'] },
      { letter: 't', classes: ['_2'] },
      { letter: 'w', classes: ['_2'] },
      { letter: 'o', classes: ['_2'] },
      { letter: 't', classes: ['_3'] },
      { letter: 'h', classes: ['_3'] },
      { letter: 'r', classes: ['_3'] },
      { letter: 'e', classes: ['_3'] },
      { letter: 'e', classes: ['_3'] }
    ],
    [
      { letter: 'f', classes: ['_4'] },
      { letter: 'o', classes: ['_4'] },
      { letter: 'u', classes: ['_4'] },
      { letter: 'r', classes: ['_4'] },
      { letter: 'f', classes: ['_5'] },
      { letter: 'i', classes: ['_5'] },
      { letter: 'v', classes: ['_5'] },
      { letter: 'e', classes: ['_5'] },
      { letter: 's', classes: ['_6'] },
      { letter: 'i', classes: ['_6'] },
      { letter: 'x', classes: ['_6'] }
    ],
    [
      { letter: 'e', classes: ['_11'] },
      { letter: 'l', classes: ['_11'] },
      { letter: 'e', classes: ['_11'] },
      { letter: 'v', classes: ['_11'] },
      { letter: 'e', classes: ['_11'] },
      { letter: 'n', classes: ['_11'] },
      { letter: 'e', classes: ['_8'] },
      { letter: 'i', classes: ['_8'] },
      { letter: 'g', classes: ['_8'] },
      { letter: 'h', classes: ['_8'] },
      { letter: 't', classes: ['_8'] }
    ],
    [
      { letter: 'n', classes: ['_9'] },
      { letter: 'i', classes: ['_9'] },
      { letter: 'n', classes: ['_9'] },
      { letter: 'e', classes: ['_9'] },
      { letter: 'f', classes: [] },
      { letter: 't', classes: ['_12', '_0'] },
      { letter: 'w', classes: ['_12', '_0'] },
      { letter: 'e', classes: ['_12', '_0'] },
      { letter: 'l', classes: ['_12', '_0'] },
      { letter: 'v', classes: ['_12', '_0'] },
      { letter: 'e', classes: ['_12', '_0'] }
    ],
    [
      { letter: 'o', classes: [] },
      { letter: 't', classes: ['_10'] },
      { letter: 'e', classes: ['_10'] },
      { letter: 'n', classes: ['_10'] },
      { letter: 'b', classes: [] },
      { letter: 'h', classes: ['oclock'] },
      { letter: 'o', classes: ['oclock'] },
      { letter: 'r', classes: ['oclock'] },
      { letter: 'o', classes: ['oclock'] },
    ]
  ];

  // Time calculation logic
  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const newActiveClasses = new Set(['its', 'active']);
    
    // Simple time logic
    const hour = hours % 12 || 12;
    
    // Add hour class
    if (hour === 1) newActiveClasses.add('_1');
    else if (hour === 2) newActiveClasses.add('_2');
    else if (hour === 3) newActiveClasses.add('_3');
    else if (hour === 4) newActiveClasses.add('_4');
    else if (hour === 5) newActiveClasses.add('_5');
    else if (hour === 6) newActiveClasses.add('_6');
    else if (hour === 7) newActiveClasses.add('_7');
    else if (hour === 8) newActiveClasses.add('_8');
    else if (hour === 9) newActiveClasses.add('_9');
    else if (hour === 10) newActiveClasses.add('_10');
    else if (hour === 11) newActiveClasses.add('_11');
    else if (hour === 12) newActiveClasses.add('_12');
    
    // Add minute-based classes
    if (minutes >= 0 && minutes < 5) {
      newActiveClasses.add('oclock');
    } else if (minutes >= 5 && minutes < 10) {
      newActiveClasses.add('five', 'after');
    } else if (minutes >= 10 && minutes < 15) {
      newActiveClasses.add('ten', 'after');
    } else if (minutes >= 15 && minutes < 20) {
      newActiveClasses.add('quarter', 'after');
    } else if (minutes >= 20 && minutes < 25) {
      newActiveClasses.add('twenty', 'after');
    } else if (minutes >= 25 && minutes < 30) {
      newActiveClasses.add('twenty', 'five', 'after');
    } else if (minutes >= 30 && minutes < 35) {
      newActiveClasses.add('thirty', 'after');
    } else if (minutes >= 35 && minutes < 40) {
      newActiveClasses.add('twenty', 'five', 'to');
    } else if (minutes >= 40 && minutes < 45) {
      newActiveClasses.add('twenty', 'to');
    } else if (minutes >= 45 && minutes < 50) {
      newActiveClasses.add('quarter', 'to');
    } else if (minutes >= 50 && minutes < 55) {
      newActiveClasses.add('ten', 'to');
    } else if (minutes >= 55) {
      newActiveClasses.add('five', 'to');
    }
    
    setActiveClasses(newActiveClasses);
  };

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // Inline styles
  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: '#000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    clock: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1vh',
      padding: '2vh',
      maxWidth: '90vw',
      maxHeight: '90dvh'
    },
    row: {
      display: 'flex',
      gap: '1vw',
      flexWrap: 'nowrap'
    },
    letter: {
      width: 'clamp(2vw, 4vh, 40px)',
      height: 'clamp(2vw, 4vh, 40px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(1.5vw, 3vh, 24px)',
      fontFamily: 'Arial, sans-serif',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: 'rgba(255, 255, 255, 0.3)',
      textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
      borderRadius: '4px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    active: {
      color: '#fff',
      textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      transform: 'scale(1.1)',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.clock}>
        {wordRows.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((letterData, letterIndex) => {
              const isActive = letterData.classes.some(cls => activeClasses.has(cls));
              
              return (
                <div
                  key={`${rowIndex}-${letterIndex}`}
                  style={{
                    ...styles.letter,
                    ...(isActive && styles.active)
                  }}
                >
                  {letterData.letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordClock;
