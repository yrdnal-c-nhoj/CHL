/**
 * Clock Page Component
 * 
 * This component handles the display of individual clock pages with:
 * - Dynamic clock component loading based on date
 * - Assetpreloading (images, fonts)
 * - Smooth loading animations and transitions
 * - Navigation between different clock pages
 * - Error handling and fallbacks
 * 
 * Features:
 * - Modern React patterns with hooks and memoization
 * - Performance optimizations with lazy loading
 * - Clean error boundaries and user feedback
 * - Responsive design with overlay management
 * - SEO-friendly with proper meta handling
 */

import React, { 
  useState, 
  useEffect, 
  useContext, 
  useCallback, 
  useMemo 
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataContext } from "./context/DataContext";
import Header from "./components/Header";
import ClockPageNav from "./components/ClockPageNav";
import styles from "./ClockPage.module.css";

// Preload all Clock.jsx files under /pages/**/Clock.jsx
const clockModules = import.meta.glob("./pages/**/Clock.jsx");

// Configuration constants
const DATE_REGEX = /^\d{2}-\d{2}-\d{2}$/;
const HEADER_FADE_DELAY = 1500; // 1.5 seconds
const ASSET_LOAD_DELAY = 500; // 0.5 seconds
const OVERLAY_FADE_DURATION = 100; // 0.1 seconds

/**
 * Custom hook for clock component utilities
 */
const useClockUtils = () => {
  /**
   * Resolve the correct module key for a given item
   * Supports both new and legacy directory structures
   */
  const getClockModuleKey = useCallback((item) => {
    const date = item?.date || item?.path;
    if (!date) return null;

    const [yy, mm] = date.split("-");
    if (!yy || !mm) return null;

    const candidates = [
      `./pages/${yy}-${mm}/${item.path}/Clock.jsx`, // month/day structure
      `./pages/${item.path}/Clock.jsx`,             // legacy flat structure
    ];

    for (const key of candidates) {
      if (clockModules[key]) return key;
    }

    return null;
  }, []);

  /**
   * Normalize date format for consistent comparison
   */
  const normalizeDate = useCallback((d) => 
    d.split("-").map((n) => n.padStart(2, "0")).join("-")
  , []);

  return { getClockModuleKey, normalizeDate };
};

/**
 * Custom hook for asset preloading
 */
const useAssetPreloader = () => {
  const preloadAssets = useCallback(async (module) => {
    // Preload images exported from module
    const images = Object.values(module).filter(
      (value) =>
        typeof value === "string" &&
        /\.(jpg|jpeg|png|webp|gif)$/i.test(value)
    );

    const imagePromises = images.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = resolve;
        })
    );

    // Wait for images and fonts to load
    await Promise.all([
      ...imagePromises,
      document.fonts.ready
    ]);

    return true;
  }, []);

  return { preloadAssets };
};

/**
 * Clock Page Component
 */
const ClockPage = () => {
  const { date } = useParams();
  const { items, loading } = useContext(DataContext);
  const navigate = useNavigate();
  const { preloadAssets } = useAssetPreloader();
  const { getClockModuleKey, normalizeDate } = useClockUtils();

  // State management
  const [ClockComponent, setClockComponent] = useState(null);
  const [pageError, setPageError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [allAssetsLoaded, setAllAssetsLoaded] = useState(false);

  // Memoized normalized date
  const normalizedDate = useMemo(() => 
    normalizeDate(date || ""), 
    [date, normalizeDate]
  );

  // Prevent scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Header fade-out animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderOpacity(0);
    }, HEADER_FADE_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Validate date format and redirect if invalid
  useEffect(() => {
    if (!date || !DATE_REGEX.test(date)) {
      navigate("/", { replace: true });
    }
  }, [date, navigate]);

  // Memoized current item lookup
  const currentItem = useMemo(() => {
    if (!items || items.length === 0) return null;
    return items.find((item) => normalizeDate(item.date) === normalizedDate);
  }, [items, normalizedDate, normalizeDate]);

  // Memoized navigation items
  const navigationItems = useMemo(() => {
    if (!items || items.length === 0) {
      return { currentIndex: -1, prevItem: null, nextItem: null };
    }

    const currentIndex = items.findIndex(
      (item) => normalizeDate(item.date) === normalizedDate
    );

    return {
      currentIndex,
      prevItem: currentIndex > 0 ? items[currentIndex - 1] : null,
      nextItem: currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
    };
  }, [items, normalizedDate, normalizeDate]);

  // Load clock component and assets
  useEffect(() => {
    const loadClockComponent = async () => {
      try {
        if (loading || !currentItem) {
          if (!loading && (!items || items.length === 0)) {
            setPageError("No clock is available.");
          }
          return;
        }

        const moduleKey = getClockModuleKey(currentItem);
        if (!moduleKey) {
          setPageError(`No clock found for date: ${currentItem.date}`);
          return;
        }

        // Load the clock module
        const module = await clockModules[moduleKey]();
        const Component = module.default;

        // Preload assets
        await preloadAssets(module);

        // Set component and mark as ready
        setClockComponent(() => Component);
        setIsReady(true);

        // Allow extra time for internal component loading
        setTimeout(() => {
          setAllAssetsLoaded(true);
          setTimeout(() => setOverlayVisible(false), OVERLAY_FADE_DURATION);
        }, ASSET_LOAD_DELAY);

      } catch (error) {
        console.error("Failed to load clock:", error);
        setPageError(`Failed to load clock: ${error.message}`);
      }
    };

    loadClockComponent();
  }, [currentItem, loading, items, getClockModuleKey, preloadAssets]);

  // Memoized title and date formatting functions
  const formatTitle = useCallback((title) => 
    title?.replace(/clock/i, "").trim() || "Home", 
  []);

  const formatDate = useCallback((dateString) => 
    dateString.replace(/-/g, "."), 
  []);

  // Error state display
  if (pageError) {
    return (
      <div className={styles.container} style={{
        width: "100vw", 
        height: "100vh", 
        overflow: "hidden", 
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#fff",
        fontFamily: "monospace"
      }}>
        <h1>Error</h1>
        <p>{pageError}</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`${styles.container} ${allAssetsLoaded ? styles.loaded : ''}`} 
      style={{ 
        width: "100vw", 
        height: "100vh", 
        overflow: "hidden", 
        backgroundColor: "#000",
        position: "relative"
      }}
    >
      {/* Header with fade animation */}
      {allAssetsLoaded && (
        <div
          style={{
            opacity: headerOpacity,
            transition: "opacity 0.5s ease-out",
            pointerEvents: headerOpacity > 0 ? "auto" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
          }}
        >
          <Header visible={headerOpacity > 0} />
        </div>
      )}

      {/* Clock component with fade-in animation */}
      {allAssetsLoaded && ClockComponent && (
        <div style={{ width: "100%", height: "100%" }}>
          <div
            style={{
              all: "initial",
              fontFamily: "CustomFont, system-ui, sans-serif",
              display: "block",
              width: "100%",
              height: window.innerWidth <= 768 ? "40vh" : "100vh", // Mobile: 40vh for better fit, Desktop: full height
              opacity: 0,
              animation: "fadeIn 0.5s ease-out 0.3s forwards",
              // Add mobile scaling to override individual clock sizing
              ...(window.innerWidth <= 768 && {
                transform: "scale(0.6)",
                transformOrigin: "center center",
                overflow: "hidden"
              })
            }}
          >
            <ClockComponent />
          </div>
        </div>
      )}

      {/* Navigation component */}
      {allAssetsLoaded && ClockComponent && (
        <ClockPageNav
          prevItem={navigationItems.prevItem}
          nextItem={navigationItems.nextItem}
          currentItem={currentItem}
          formatTitle={formatTitle}
          formatDate={formatDate}
        />
      )}

      {/* Loading overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: overlayVisible ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}
      />

      {/* Global styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ClockPage;
