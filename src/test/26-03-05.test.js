import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import Clock from '../pages/26-03/26-03-05/Clock'

// Mock the font loader utility
vi.mock('../../utils/fontLoader', () => ({
  default: vi.fn(() => true) // Return true to indicate font is ready
}))

describe('26-03-05 Retro Terminal Clock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with current time', () => {
    const testTime = new Date('2024-01-01T12:30:45')
    vi.setSystemTime(testTime)

    render(React.createElement(Clock))
    
    expect(screen.getByText('> 12:30:45')).toBeInTheDocument()
  })

  it('updates time every second', async () => {
    const testTime = new Date('2024-01-01T12:30:45')
    vi.setSystemTime(testTime)

    render(React.createElement(Clock))
    
    // Initial time
    expect(screen.getByText('> 12:30:45')).toBeInTheDocument()
    
    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByText('> 12:30:46')).toBeInTheDocument()
    })
  })

  it('shows boot sequence text progressively', async () => {
    render(React.createElement(Clock))
    
    // Should start with connecting text
    await waitFor(() => {
      expect(screen.getByText(/CONNECTING/)).toBeInTheDocument()
    })
    
    // Should complete boot sequence
    vi.advanceTimersByTime(500) // Wait for typing to complete
    
    await waitFor(() => {
      expect(screen.getByText('E-MAIL:')).toBeInTheDocument()
      expect(screen.getByText('cubistheart@gmail.com')).toBeInTheDocument()
    })
  })

  it('shows email link after boot sequence', async () => {
    render(React.createElement(Clock))
    
    // Wait for boot sequence to complete
    vi.advanceTimersByTime(500)
    
    await waitFor(() => {
      const emailLink = screen.getByRole('link', { name: /cubistheart@gmail.com/ })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute('href', 'mailto:cubistheart@gmail.com')
    })
  })

  it('has proper terminal styling', () => {
    render(React.createElement(Clock))
    
    const container = screen.getByRole('main') || document.querySelector('[style*="background: #050505"]')
    expect(container).toBeInTheDocument()
    
    // Check for VT323 font family in styles
    expect(container).toHaveStyle({ fontFamily: expect.stringContaining('VT323') })
  })
})
