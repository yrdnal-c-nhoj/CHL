import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import App from '../App';

// Mock all lazy-loaded components
vi.mock('../Home.jsx', () => ({
  default: () => 'Home Component',
}));

vi.mock('../ClockPage.tsx', () => ({
  ClockPage: () => 'ClockPage Component',
}));

vi.mock('../Today.tsx', () => ({
  default: () => 'Today Component',
}));

vi.mock('../Contact.jsx', () => ({
  default: () => 'Contact Component',
}));

vi.mock('../ListPage.tsx', () => ({
  default: () => 'ListPage Component',
}));

vi.mock('../components/TagList.tsx', () => ({
  default: () => 'TagList Component',
}));

vi.mock('../components/admin/Tagger.tsx', () => ({
  default: () => 'Tagger Component',
}));

vi.mock('../components/admin/TagManager.tsx', () => ({
  default: () => 'TagManager Component',
}));

vi.mock('../components/admin/TagByImage.tsx', () => ({
  default: () => 'TagByImage Component',
}));

vi.mock('../pages/AllTagsPage.tsx', () => ({
  default: () => 'AllTagsPage Component',
}));

vi.mock('../components/admin/AdminDashboard.tsx', () => ({
  default: () => 'AdminDashboard Component',
}));

// Mock DataContext with proper exports
vi.mock('../context/DataContext', async () => {
  const actual = await vi.importActual('../context/DataContext');
  return {
    ...actual,
    DataProvider: ({ children }: { children: React.ReactNode }) => children,
    useDataContext: () => ({ items: [], loading: false, error: null }),
  };
});

// Mock analytics
vi.mock('../analytics', () => ({
  pageview: vi.fn(),
}));

const waitForEffects = () => new Promise(resolve => setTimeout(resolve, 0));

describe('App Regression Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  describe('Scroll-lock effect on clock pages', () => {
    it('should set overflow: hidden on body and documentElement when on a clock page', async () => {
      render(
        <MemoryRouter initialEntries={['/26-09-20']}>
          <App />
        </MemoryRouter>,
      );

      await waitForEffects();

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('should set overflow: hidden on body and documentElement when on /today page', async () => {
      render(
        <MemoryRouter initialEntries={['/today']}>
          <App />
        </MemoryRouter>,
      );

      await waitForEffects();

      expect(document.body.style.overflow).toBe('hidden');
      expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('should set overflow: auto on body and documentElement when on home page', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>,
      );

      await waitForEffects();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.documentElement.style.overflow).toBe('auto');
    });

    it('should set overflow: auto on body and documentElement when on contact page', async () => {
      render(
        <MemoryRouter initialEntries={['/contact']}>
          <App />
        </MemoryRouter>,
      );

      await waitForEffects();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.documentElement.style.overflow).toBe('auto');
    });

    it('should set overflow: auto on body and documentElement when on list page', async () => {
      render(
        <MemoryRouter initialEntries={['/list']}>
          <App />
        </MemoryRouter>,
      );

      await waitForEffects();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.documentElement.style.overflow).toBe('auto');
    });
  });
});

describe('ClockPage Regression Tests', () => {
  describe('Container width should not allow scrolling', () => {
    it('ClockPage.module.css .container should have overflow: hidden', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(process.cwd(), 'src/pages/ClockPage.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      expect(cssContent).toMatch(/\.container\s*\{[^}]*overflow:\s*hidden/);
    });

    it('ClockPage.module.css .container should have width: 100%', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(process.cwd(), 'src/pages/ClockPage.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      expect(cssContent).toMatch(/\.container\s*\{[^}]*width:\s*100%/);
    });

    it('ClockPage.module.css .container should have height: 100dvh', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(process.cwd(), 'src/pages/ClockPage.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      expect(cssContent).toMatch(/\.container\s*\{[^}]*height:\s*100dvh/);
    });
  });

  describe('ClockPage component renders without scroll', () => {
    it('should render ClockPage without horizontal scroll enabling properties', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(process.cwd(), 'src/pages/ClockPage.module.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Should not have width > 100% or any horizontal scroll enabling properties
      expect(cssContent).not.toMatch(/width:\s*(?:100vw|calc\(.*100vw)/);
      expect(cssContent).not.toMatch(/overflow-x:\s*(?:auto|scroll)/);
    });
  });
});