import { useState, useEffect } from 'react';

export const useAutoHeader = (delay: number = 1500) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};