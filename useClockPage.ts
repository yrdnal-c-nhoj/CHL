import { useState, useEffect, useRef } from 'react';

interface ClockModule {
  default: React.ComponentType;
  assets?: unknown;
}

const ClockLoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      color: '#888',
      fontFamily: 'monospace',
      fontSize: '1.2rem',
    }}
  >
    Loading...
  </div>
);

export function useClockPage(currentItem: { date: string } | null) {
  const [ClockComponent, setClockComponent] = useState<React.ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReadyRef = useRef(isReady);

  useEffect(() => {
    const loadClockComponent = async () => {
      try {
        if (!currentItem) return;

        const module = await import(`../path/to/clock/${currentItem.date}`);
        setClockComponent(module.default);
        setIsReady(true);
      } catch (err) {
        setError('Failed to load clock component');
        console.error(err);
      }
    };

    loadClockComponent();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentItem]);

  return { ClockComponent, isReady, error, overlayVisible };
}
