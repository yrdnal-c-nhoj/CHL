module.exports = {
  ci: {
    collect: {
      // The build command must be run before this script.
      // Vite's default build output directory is 'dist'.
      staticDistDir: './dist',
      // The number of times to run Lighthouse on each URL to get stable results.
      numberOfRuns: 3,
    },
    assert: {
      // Assertions based on the performance budget in ARCHITECTURE.md
      assertions: {
        // Core Web Vitals & Categories
        'categories:performance': ['warn', { minScore: 0.9 }], // Target: >90
        'categories:accessibility': ['error', { minScore: 1 }], // Aim for perfect accessibility
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Specific budget metrics from ARCHITECTURE.md
        'interactive': ['error', { maxNumericValue: 3000 }], // Time to Interactive < 3s
        'resource-summary:total:size': ['warn', { maxNumericValue: 512000 }], // Total page weight < 500KB
        'resource-summary:script:size': ['warn', { maxNumericValue: 153600 }], // Initial JS bundle < 150KB
      },
    },
    upload: {
      // Optional: Upload reports to a temporary public storage for easy viewing.
      target: 'temporary-public-storage',
    },
  },
};