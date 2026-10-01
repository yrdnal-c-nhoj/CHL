import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// matchMedia (jsdom doesn't implement it)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
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

// Observers. These are called with `new`, so they must be classes
// (Vitest 4 throws "is not a constructor" for arrow-function implementations).
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class MockIntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal('ResizeObserver', MockResizeObserver);
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// FontFace API
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

vi.stubGlobal('FontFace', MockFontFace);

Object.defineProperty(document, 'fonts', {
  value: {
    add: vi.fn(),
    delete: vi.fn(),
    check: vi.fn(() => true),
    load: vi.fn().mockResolvedValue([]),
    ready: Promise.resolve([]),
  },
  writable: true,
  configurable: true,
});

// jsdom has no canvas; stub getContext so clocks drawing on <canvas>
// don't log "Not implemented" errors or crash on a null context.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

Element.prototype.scrollIntoView = vi.fn();
