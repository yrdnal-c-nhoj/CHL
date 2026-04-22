import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build artifacts and generated files
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'scripts/**',
      'babel.config.js',
      '*.min.js',
      'src/pages/2025/**',
      'src/pages/2026/**',
      'src/assets/images/**',
      'src/test/**',
      'src/templates/**',
      'src/**/*.jsx'
    ],
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
      import: pluginImport,
      'jsx-a11y': pluginJsxA11y,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
      'import/core-modules': ['fs', 'path', 'os', 'crypto'],
    },
    rules: {
      // React
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'warn',
      'react/no-unsafe': 'warn',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],

      // React Hooks
      ...pluginReactHooks.configs.recommended.rules,

      // Import/Export rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'warn',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-webpack-loader-syntax': 'error',

      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/mouse-events-have-key-events': 'warn',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // Block style tag injection in clock pages
      'react/no-danger': 'error',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  // Specific rules for clock pages to block style injection
  {
    files: ['**/pages/**/Clock.tsx'],
    rules: {
      'react/no-danger': 'error',
      'react/jsx-no-target-blank': 'error',
      'no-template-curly-in-string': 'error',
      // Block style tags and inline styles in clock pages
      'react/no-unknown-property': ['error', { ignore: ['cssText'] }],
    },
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
    },
  },

  // General best-practice rules for all files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        Headers: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'warn',
      'prefer-destructuring': 'warn',
      'object-shorthand': 'error',
      'no-duplicate-imports': 'warn',
      'no-unused-expressions': 'error',
      'no-useless-return': 'error',
      'no-else-return': 'error',
      'no-nested-ternary': 'warn',
      'max-depth': ['warn', 4],
      'max-lines': ['warn', 500],
      'max-lines-per-function': ['warn', 50],
      complexity: ['warn', 10],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'space-before-blocks': ['error', 'always'],
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'no-multi-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'no-loop-func': 'warn',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      radix: 'error',
      yoda: 'error',
    },
  },

  // File-specific overrides
  {
    files: ['*.js', '*.jsx'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  {
    files: ['*.test.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: [
      '*.config.{js,ts}',
      'vite.config.ts',
      'postcss.config.js',
      'tailwind.config.js',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['src/assets/**/*'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Prettier must be last — disables style rules that conflict with Prettier
  prettierConfig,
);
