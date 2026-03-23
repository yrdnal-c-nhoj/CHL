import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build artifacts and generated files
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**', 'scripts/**', '*.min.js'],
  },

  // Base JS rules for all JS/JSX files
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ...pluginJs.configs.recommended,
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // TypeScript rules for TS/TSX files
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),

  // React rules for all JSX/TSX files
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/self-closing-comp': 'error',
      'react/no-deprecated': 'error',
      'react/no-unknown-property': 'warn',
      // React Hooks
      ...pluginReactHooks.configs.recommended.rules,
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
    },
  },

  // General best-practice rules for all files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // Prettier must be last — disables style rules that conflict with Prettier
  prettierConfig,
);
