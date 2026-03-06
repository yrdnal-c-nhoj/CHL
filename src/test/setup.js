import '@testing-library/jest-dom'

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock FontFace API
global.FontFace = vi.fn().mockImplementation(() => ({
  load: vi.fn().mockResolvedValue({}),
  loaded: Promise.resolve({}),
}))

// Mock document.fonts
Object.defineProperty(document, 'fonts', {
  value: {
    add: vi.fn(),
    load: vi.fn().mockResolvedValue([]),
    ready: Promise.resolve([]),
  },
  writable: true,
})
