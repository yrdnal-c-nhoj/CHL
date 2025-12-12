/** @jsxImportSource react */
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DataContext } from './context/DataContext'
import Header from './components/Header'
import ClockPageNav from './components/ClockPageNav'
import styles from './ClockPage.module.css'

// Preload all Clock.jsx files under /pages/**/Clock.jsx
const clockModules = import.meta.glob('./pages/**/Clock.jsx')

const normalizeDate = d =>
  d
    .split('-')
    .map(n => n.padStart(2, '0'))
    .join('-')

export default function ClockPage () {
  const { date } = useParams()
  const { items, loading } = useContext(DataContext)
  const navigate = useNavigate()

  const [ClockComponent, setClockComponent] = useState(null)
  const [pageError, setPageError] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [headerOpacity, setHeaderOpacity] = useState(1) // State for header opacity

  // Hide overlay if an error occurs so the error is visible and page isn't stuck black
  useEffect(() => {
    if (pageError) setOverlayVisible(false)
  }, [pageError])

  // Safety: ensure overlay clears after a few seconds even if font/module load stalls
  useEffect(() => {
    const timeout = setTimeout(() => setOverlayVisible(false), 3000)
    return () => clearTimeout(timeout)
  }, [date])

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => (document.body.style.overflow = '')
  }, [])

  // Fade out header after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderOpacity(0) // Set opacity to 0 after 1.5 seconds
    }, 1500) // 1.5 seconds

    return () => clearTimeout(timer) // Cleanup timeout on unmount
  }, [])

  // Load everything: component, images, fonts
  useEffect(() => {
    const loadEverything = async () => {
      try {
        if (loading) return

        if (!items || items.length === 0) {
          setPageError('No clock is available.')
          return
        }

        if (!/^\d{2}-\d{2}-\d{2}$/.test(date)) {
          navigate('/', { replace: true })
          return
        }

        const item = items.find(
          i => normalizeDate(i.date) === normalizeDate(date)
        )
        if (!item) {
          navigate('/', { replace: true })
          return
        }

        const key = `./pages/${item.path}/Clock.jsx`
        if (!clockModules[key]) {
          setPageError(`No clock found at path: ${key}`)
          return
        }

        const mod = await clockModules[key]()
        const Component = mod.default

        // Preload images exported from module
        const images = Object.values(mod).filter(
          v =>
            typeof v === 'string' &&
            (v.endsWith('.jpg') ||
              v.endsWith('.png') ||
              v.endsWith('.webp') ||
              v.endsWith('.gif'))
        )
        await Promise.all(
          images.map(
            src =>
              new Promise(resolve => {
                const img = new Image()
                img.src = src
                img.onload = img.onerror = resolve
              })
          )
        )

        // Wait for fonts to load
        await document.fonts.ready

        setClockComponent(() => Component)
        setIsReady(true)

        // Fade out overlay quickly
        setTimeout(() => setOverlayVisible(false), 50)
      } catch (err) {
        setPageError(`Failed to load clock: ${err.message}`)
        setOverlayVisible(false)
      }
    }

    loadEverything()
  }, [date, items, loading, navigate])

  // Calculate prev/next items for navigation
  const currentIndex =
    items?.findIndex(i => normalizeDate(i.date) === normalizeDate(date)) ?? -1
  const currentItem = currentIndex >= 0 ? items[currentIndex] : null
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null
  const nextItem =
    currentIndex >= 0 && currentIndex < items.length - 1
      ? items[currentIndex + 1]
      : null

  return (
    <div
      className={styles.container}
      style={{ width: '100vw', height: '100dvh', overflow: 'hidden' }}
    >
      {pageError && <div className={styles.error}>{pageError}</div>}

      {ClockComponent && (
        <>
          <div style={{ width: '100%', height: '100%' }}>
            {/* Font isolation wrapper */}
            <div
              style={{
                all: 'initial',
                fontFamily: 'CustomFont, system-ui, sans-serif',
                display: 'block',
                width: '100%',
                height: '100%'
              }}
            >
              <ClockComponent />
            </div>
          </div>
        </>
      )}

      {/* Black overlay with quick fade */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#000',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: overlayVisible ? 1 : 0,
          transition: 'opacity 0.2s ease-out'
        }}
      />
    </div>
  )
}
