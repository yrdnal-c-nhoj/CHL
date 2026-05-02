module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  rules: {
    // BTS Standard: Forbidden Patterns
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-restricted-globals': ['error', 'setInterval', 'setTimeout'],
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.property.name='querySelector']",
        message: 'BTS Standard: Use React refs instead of document.querySelector.',
      },
      {
        selector: "CallExpression[callee.property.name='getElementById']",
        message: 'BTS Standard: Use React refs instead of document.getElementById.',
      }
    ],

    // BTS Standard: Import Organization
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        pathGroups: [
          { pattern: 'react', group: 'builtin', position: 'before' },
          { pattern: '@/utils/hooks', group: 'internal', position: 'before' },
          { pattern: '@/utils/fontLoader', group: 'internal', position: 'before' },
          { pattern: '@/utils/clockUtils', group: 'internal', position: 'before' },
          { pattern: '@/assets/images/**', group: 'internal', position: 'after' },
          { pattern: '@/assets/fonts/**', group: 'internal', position: 'after' },
          { pattern: '@/types/**', group: 'internal', position: 'after' },
          { pattern: './*.module.css', group: 'index', position: 'after' },
          { pattern: '@/components/**', group: 'internal', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],

    // BTS Standard: Performance & Complexity
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', 10],
  },
};