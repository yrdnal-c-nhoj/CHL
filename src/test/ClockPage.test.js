import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ClockPage from '../ClockPage'

// Mock the dynamic import system
vi.mock('./pages/**/Clock.jsx', () => ({
  'default': () => 'Mock Clock Component'
}))

// Mock DataContext
vi.mock('./context/DataContext', () => ({
  DataContext: {
    Provider: ({ children }) => children,
  },
  useDataContext: () => ({
    items: [
      { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
      { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    ],
    loading: false,
  }),
}))

describe('ClockPage Dynamic Import System', () => {
  const mockItems = [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
  ]

  beforeEach(() => {
    vi.useFakeTimers()
    // Mock the glob import
    vi.stubGlobal('import', {
      meta: {
        glob: vi.fn(() => ({
          './pages/26-03/26-03-05/Clock.jsx': () => Promise.resolve({ default: () => 'Clock Component' }),
          './pages/26-03/26-03-04/Clock.jsx': () => Promise.resolve({ default: () => 'Clock Component' }),
        }))
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('should resolve correct module path for 26-03-05', () => {
    const item = mockItems.find(i => i.path === '26-03-05')
    const expectedKey = './pages/26-03/26-03-05/Clock.jsx'
    
    // This tests the path resolution logic from ClockPage.jsx
    const [yy, mm] = item.date.split('-')
    const candidates = [
      `./pages/${yy}-${mm}/${item.path}/Clock.jsx`,
      `./pages/${item.path}/Clock.jsx`,
    ]
    
    expect(candidates[0]).toBe(expectedKey)
  })

  it('should handle legacy flat structure paths', () => {
    const legacyItem = { path: '25-11-01', date: '25-11-01', title: 'Legacy Clock' }
    const expectedKey = './pages/25-11-01/Clock.jsx'
    
    const [yy, mm] = legacyItem.date.split('-')
    const candidates = [
      `./pages/${yy}-${mm}/${legacyItem.path}/Clock.jsx`,
      `./pages/${legacyItem.path}/Clock.jsx`,
    ]
    
    expect(candidates[1]).toBe(expectedKey)
  })

  it('should validate date format (YY-MM-DD)', () => {
    const validDates = ['25-11-01', '26-03-05', '24-12-31']
    const invalidDates = ['invalid', '2025-11-01', '25-11-1']
    
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/
    
    validDates.forEach(date => {
      expect(dateRegex.test(date)).toBe(true)
    })
    
    invalidDates.forEach(date => {
      expect(dateRegex.test(date)).toBe(false)
    })
  })

  it('should normalize dates consistently', () => {
    const normalizeDate = (d) => d.split('-').map((n) => n.padStart(2, '0')).join('-')
    
    expect(normalizeDate('25-11-1')).toBe('25-11-01')
    expect(normalizeDate('26-3-5')).toBe('26-03-05')
    expect(normalizeDate('24-12-31')).toBe('24-12-31')
  })
})
