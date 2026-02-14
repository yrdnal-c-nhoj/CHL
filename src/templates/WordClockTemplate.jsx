import React, { useEffect, useState, useMemo } from 'react';
import { useFontLoader } from '../../utils/fontLoader.js';

// --- Assets ---
import wordFont from '../../../assets/fonts/serif-bold.ttf';

// --- Configuration ---
const CONFIG = {
  UPDATE_INTERVAL: 60000, // Update every minute for word clock
  FADE_DURATION: 500,
  COLORS: {
    background: '#f8f8f8',
    text: '#2c3e50',
    highlight: '#e74c3c',
    subtle: '#95a5a6',
  },
  LAYOUT: {
    rows: 7,
    cols: 11,
  }
};

// Word clock matrix - each row represents time words
const WORD_MATRIX = [
  ['I', 'T', 'L', 'I', 'S', 'A', 'S', 'T', 'I', 'M', 'E'],
  ['A', 'C', 'Q', 'U', 'A', 'R', 'T', 'E', 'R', 'D', 'C'],
  ['T', 'W', 'E', 'N', 'T', 'Y', 'F', 'I', 'V', 'E', 'X'],
  ['H', 'A', 'L', 'F', 'B', 'T', 'O', 'P', 'A', 'S', 'T'],
  ['S', 'E', 'V', 'E', 'N', 'T', 'E', 'N', 'I', 'N', 'E'],
  ['O', 'N', 'E', 'T', 'W', 'O', 'T', 'H', 'R', 'E', 'E'],
  ['F', 'O', 'U', 'R', 'F', 'I', 'V', 'E', 'S', 'I', 'X']
];

/**
 * Custom Hook: useWordClock
 * Calculates which words to highlight based on current time
 */
const useWordClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, CONFIG.UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    
    // Convert to word clock format
    const highlightedWords = new Set();
    
    // Always highlight "IT IS"
    highlightedWords.add('0-0'); // I
    highlightedWords.add('0-1'); // T
    highlightedWords.add('0-3'); // I
    highlightedWords.add('0-4'); // S
    
    let hourWord = hours % 12;
    if (hourWord === 0) hourWord = 12;
    
    // Handle minutes
    if (minutes === 0) {
      // Exact hour
      highlightedWords.add('5-0'); // O
      highlightedWords.add('5-1'); // N
      highlightedWords.add('5-2'); // E
      addHourWords(highlightedWords, hourWord);
    } else if (minutes <= 30) {
      // Past the hour
      if (minutes >= 5 && minutes < 10) {
        highlightedWords.add('2-7'); // F
        highlightedWords.add('2-8'); // I
        highlightedWords.add('2-9'); // V
        highlightedWords.add('2-10'); // E
      } else if (minutes >= 10 && minutes < 15) {
        highlightedWords.add('1-5'); // T
        highlightedWords.add('1-6'); // E
        highlightedWords.add('1-7'); // N
      } else if (minutes >= 15 && minutes < 20) {
        highlightedWords.add('1-2'); // Q
        highlightedWords.add('1-3'); // U
        highlightedWords.add('1-4'); // A
        highlightedWords.add('1-5'); // R
        highlightedWords.add('1-6'); // T
        highlightedWords.add('1-7'); // E
        highlightedWords.add('1-8'); // R
      } else if (minutes >= 20 && minutes < 25) {
        highlightedWords.add('2-1'); // W
        highlightedWords.add('2-2'); // E
        highlightedWords.add('2-3'); // N
        highlightedWords.add('2-4'); // T
        highlightedWords.add('2-5'); // Y
      } else if (minutes >= 25 && minutes < 30) {
        highlightedWords.add('2-1'); // W
        highlightedWords.add('2-2'); // E
        highlightedWords.add('2-3'); // N
        highlightedWords.add('2-4'); // T
        highlightedWords.add('2-5'); // T
        highlightedWords.add('2-7'); // F
        highlightedWords.add('2-8'); // I
        highlightedWords.add('2-9'); // V
        highlightedWords.add('2-10'); // E
      }
      
      if (minutes > 0) {
        highlightedWords.add('3-7'); // P
        highlightedWords.add('3-8'); // A
        highlightedWords.add('3-9'); // S
        highlightedWords.add('3-10'); // T
        addHourWords(highlightedWords, hourWord);
      }
    } else {
      // To the next hour
      if (minutes > 30 && minutes <= 35) {
        highlightedWords.add('3-0'); // H
        highlightedWords.add('3-1'); // A
        highlightedWords.add('3-2'); // L
        highlightedWords.add('3-3'); // F
      } else if (minutes > 35 && minutes <= 40) {
        highlightedWords.add('2-7'); // F
        highlightedWords.add('2-8'); // I
        highlightedWords.add('2-9'); // V
        highlightedWords.add('2-10'); // E
      } else if (minutes > 40 && minutes <= 45) {
        highlightedWords.add('1-2'); // Q
        highlightedWords.add('1-3'); // U
        highlightedWords.add('1-4'); // A
        highlightedWords.add('1-5'); // R
        highlightedWords.add('1-6'); // T
        highlightedWords.add('1-7'); // E
        highlightedWords.add('1-8'); // R
      } else if (minutes > 45 && minutes <= 50) {
        highlightedWords.add('2-1'); // W
        highlightedWords.add('2-2'); // E
        highlightedWords.add('2-3'); // N
        highlightedWords.add('2-4'); // T
        highlightedWords.add('2-5'); // Y
      } else if (minutes > 50 && minutes < 60) {
        highlightedWords.add('4-2'); // V
        highlightedWords.add('4-3'); // E
        highlightedWords.add('4-4'); // E
        highlightedWords.add('4-5'); // N
        highlightedWords.add('4-6'); // T
        highlightedWords.add('4-7'); // E
        highlightedWords.add('4-8'); // N
        highlightedWords.add('4-9'); // I
        highlightedWords.add('4-10'); // N
        highlightedWords.add('4-11'); // E
      }
      
      highlightedWords.add('3-5'); // T
      highlightedWords.add('3-6'); // O
      addHourWords(highlightedWords, (hourWord % 12) + 1);
    }
    
    return {
      highlightedWords,
      currentTime: time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    };
  }, [time]);
};

/**
 * Helper function to add hour words to highlight set
 */
const addHourWords = (highlightedWords, hour) => {
  const hourWords = {
    1: ['5-3', '5-4', '5-5'], // ONE
    2: ['5-6', '5-7', '5-8'], // TWO
    3: ['5-9', '5-10', '6-0', '6-1', '6-2'], // THREE
    4: ['6-3', '6-4', '6-5', '6-6'], // FOUR
    5: ['6-7', '6-8', '6-9', '6-10'], // FIVE
    6: ['6-10', '6-11'], // SIX (note: shares with FIVE)
    7: ['4-0', '4-1', '4-2', '4-3', '4-4'], // SEVEN
    8: ['4-5', '4-6', '4-7', '4-8', '4-9'], // EIGHT
    9: ['4-9', '4-10', '4-11'], // NINE
    10: ['1-0', '1-1'], // TEN
    11: ['4-9', '4-10', '4-11'], // ELEVEN (simplified)
    12: ['1-0', '1-1', '1-2'], // TWELVE (simplified)
  };
  
  const words = hourWords[hour] || [];
  words.forEach(word => highlightedWords.add(word));
};

/**
 * Word Cell Component
 */
const WordCell = ({ letter, isHighlighted, position }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isHighlighted) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), CONFIG.FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  return (
    <div
      style={{
        ...styles.cell,
        color: isHighlighted ? CONFIG.COLORS.highlight : CONFIG.COLORS.subtle,
        fontWeight: isHighlighted ? 'bold' : 'normal',
        transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
        transition: `all ${CONFIG.FADE_DURATION}ms ease-in-out`,
      }}
    >
      {letter}
    </div>
  );
};

/**
 * Word Clock Template Component
 */
const WordClockTemplate = () => {
  const fontReady = useFontLoader('WordFont', wordFont, { timeout: 3000 });
  const { highlightedWords, currentTime } = useWordClock();

  if (!fontReady) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading word clock...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={styles.background} />
      
      {/* Word Grid */}
      <div style={styles.gridContainer}>
        {WORD_MATRIX.map((row, rowIndex) => (
          <div key={rowIndex} style={styles.row}>
            {row.map((letter, colIndex) => {
              const position = `${rowIndex}-${colIndex}`;
              const isHighlighted = highlightedWords.has(position);
              
              return (
                <WordCell
                  key={position}
                  letter={letter}
                  isHighlighted={isHighlighted}
                  position={position}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Digital time display (subtle) */}
      <div style={styles.digitalTime}>
        {currentTime}
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: CONFIG.COLORS.background,
    fontFamily: 'WordFont, serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  background: {
    position: 'absolute',
    inset: 0,
    background: CONFIG.COLORS.background,
    zIndex: 1,
  },
  
  loadingContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  
  loadingText: {
    color: CONFIG.COLORS.text,
    fontSize: '1.5rem',
    fontFamily: 'serif',
  },
  
  gridContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '2rem',
    maxWidth: '800px',
    width: '90%',
  },
  
  row: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  
  cell: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'clamp(2rem, 4vw, 3rem)',
    height: 'clamp(2rem, 4vw, 3rem)',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
    textTransform: 'uppercase',
    cursor: 'default',
    userSelect: 'none',
    borderRadius: '0.25rem',
    transition: 'all 0.3s ease',
  },
  
  digitalTime: {
    position: 'absolute',
    bottom: '2rem',
    right: '2rem',
    color: CONFIG.COLORS.subtle,
    fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
    fontFamily: 'monospace',
    opacity: 0.6,
    zIndex: 10,
  },
};

export default WordClockTemplate;
