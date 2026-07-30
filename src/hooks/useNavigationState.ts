interface NavigationState {
  scrollX: number;
  scrollY: number;
  expandedMonth?: string | undefined;
}

const NAVIGATION_STATE_KEY = 'clockNavigationState';

export const useNavigationState = () => {
  // Save navigation state before leaving
  const saveNavigationState = (expandedMonth?: string) => {
    const state: NavigationState = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      expandedMonth,
    };

    try {
      sessionStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage may be unavailable (e.g. private browsing)
    }
  };

  // Restore navigation state when returning to home
  const restoreNavigationState = (): NavigationState | null => {
    try {
      const saved = sessionStorage.getItem(NAVIGATION_STATE_KEY);
      if (saved) {
        return JSON.parse(saved) as NavigationState;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  };

  // Clear navigation state
  const clearNavigationState = () => {
    try {
      sessionStorage.removeItem(NAVIGATION_STATE_KEY);
    } catch {
      // no-op
    }
  };

  // Restore scroll position
  const restoreScrollPosition = (state: NavigationState) => {
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo(state.scrollX, state.scrollY);
    });
  };

  return {
    saveNavigationState,
    restoreNavigationState,
    clearNavigationState,
    restoreScrollPosition,
  };
};
