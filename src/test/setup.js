import '@testing-library/jest-dom';

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock FontFace API - needs to be a proper constructor
class MockFontFace {
  constructor(family, source, descriptors) {
    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
    this.loaded = Promise.resolve(this);
  }

  load() {
    return Promise.resolve(this);
  }
}

global.FontFace = MockFontFace;

// Mock document.fonts
Object.defineProperty(document, 'fonts', {
  value: {
    add: vi.fn(),
    load: vi.fn().mockResolvedValue([]),
    ready: Promise.resolve([]),
  },
  writable: true,
});
