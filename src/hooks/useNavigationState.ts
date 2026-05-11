
interface NavigationState {
  scrollX: number;
  scrollY: number;
  cursorX: number;
  cursorY: number;
  expandedMonth?: string | undefined;
}

const NAVIGATION_STATE_KEY = 'clockNavigationState';

export const useNavigationState = () => {

  // Save navigation state before leaving
  const saveNavigationState = (expandedMonth?: string) => {
    const state: NavigationState = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      cursorX: 0, // Will be captured on mouse move
      cursorY: 0, // Will be captured on mouse move
      expandedMonth
    };
    
    sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
  };

  // Restore navigation state when returning to home
  const restoreNavigationState = (): NavigationState | null => {
    try {
      const saved = sessionStorage.getItem(NAVIGATION_STATE_KEY);
      if (saved) {
        return JSON.parse(saved) as NavigationState;
      }
    } catch (error) {
      console.warn('Failed to restore navigation state:', error);
    }
    return null;
  };

  // Clear navigation state
  const clearNavigationState = () => {
    sessionStorage.removeItem(NAVIGATION_STATE_KEY);
  };

  // Restore scroll position
  const restoreScrollPosition = (state: NavigationState) => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo(state.scrollX, state.scrollY);
    }, 100);
  };

  // Restore cursor position by creating a temporary element at the saved position
  const restoreCursorPosition = (state: NavigationState) => {
    if (state.cursorX > 0 && state.cursorY > 0) {
      // Create a temporary invisible element to restore cursor focus
      const tempElement = document.createElement('div');
      tempElement.style.position = 'fixed';
      tempElement.style.left = `${state.cursorX}px`;
      tempElement.style.top = `${state.cursorY}px`;
      tempElement.style.width = '1px';
      tempElement.style.height = '1px';
      tempElement.style.opacity = '0';
      tempElement.style.pointerEvents = 'none';
      tempElement.style.zIndex = '-9999';
      tempElement.tabIndex = -1;
      
      document.body.appendChild(tempElement);
      
      // Focus the element and then remove it
      setTimeout(() => {
        tempElement.focus();
        setTimeout(() => {
          document.body.removeChild(tempElement);
        }, 100);
      }, 200);
    }
  };

  // Track cursor position
  const trackCursorPosition = () => {
    let lastCursorX = 0;
    let lastCursorY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastCursorX = e.clientX;
      lastCursorY = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      lastCursorX = e.clientX;
      lastCursorY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      return { x: lastCursorX, y: lastCursorY };
    };
  };

  return {
    saveNavigationState,
    restoreNavigationState,
    clearNavigationState,
    restoreScrollPosition,
    restoreCursorPosition,
    trackCursorPosition
  };
};
