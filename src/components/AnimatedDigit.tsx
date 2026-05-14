import React, { useState, useEffect, useRef } from 'react';
import styles from './AnimatedDigit.module.css';

interface AnimatedDigitProps {
  value: string;
  className?: string;
}

interface Layer {
  char: string;
  id: number;
}

const ANIMATION_DURATION = 800;

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({ value, className }) => {
  const [layers, setLayers] = useState<Layer[]>([{ char: value, id: 0 }]);
  const idRef = useRef(0);

  useEffect(() => {
    const top = layers[layers.length - 1];
    if (top && value !== top.char) {
      idRef.current += 1;
      setLayers((prev) => [...prev.slice(-1), { char: value, id: idRef.current }]);
    }
  }, [value, layers]);

  useEffect(() => {
    if (layers.length > 1) {
      const timer = setTimeout(() => {
        setLayers((prev) => prev.slice(-1));
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [layers.length]);

  return (
    <span className={`${styles.slot} ${className ?? ''}`}>
      {layers.map((layer, i) => {
        const isExiting = i < layers.length - 1;
        const isEntering = layers.length > 1 && i === layers.length - 1;

        const cls = [
          styles.char,
          isExiting ? styles.charExit : '',
          isEntering ? styles.charEnter : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span key={layer.id} className={cls}>
            {layer.char}
          </span>
        );
      })}
    </span>
  );
};

export default AnimatedDigit;
