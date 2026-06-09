import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import perfectionist from 'eslint-plugin-perfectionist';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';

const ERROR = 2;
const OFF = 0;

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig(
  tseslint.configs.recommended,
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  unicorn.configs.all,
  perfectionist.configs['recommended-alphabetical'],
  importPlugin.flatConfigs.react,
  importPlugin.flatConfigs['react-native'],
  importPlugin.flatConfigs.typescript,
  react.configs.flat.all,
  react.configs.flat['jsx-runtime'],
  reactRefresh.configs.recommended,
  testingLibrary.configs['flat/react'],
  eslintConfigPrettier, // last
  {
    languageOptions: {
      globals: {
        __DEV__: 'readonly', // define it as a global variable
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
      perfectionist: {
        partitionByComment: true,
        type: 'alphabetical',
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    ...reactHooks.configs.recommended,
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/consistent-type-definitions': [ERROR, 'type'],
      '@typescript-eslint/dot-notation': [ERROR, { allowKeywords: true }],
      '@typescript-eslint/no-empty-function': OFF,
      '@typescript-eslint/no-unsafe-assignment': OFF,
      '@typescript-eslint/no-useless-default-assignment': OFF,
      '@typescript-eslint/restrict-template-expressions': OFF,
      'import/no-unresolved': OFF, // handled by TypeScript
      'no-console': [ERROR, { allow: ['warn', 'error'] }],
      'no-magic-numbers': OFF,
      'perfectionist/sort-imports': OFF,
      'perfectionist/sort-objects': OFF,

      'react-refresh/only-export-components': OFF,
      'react/forbid-component-props': OFF,
      'react/jsx-filename-extension': [ERROR, { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-max-depth': [ERROR, { max: 10 }],
      'react/jsx-no-bind': OFF,
      'react/jsx-no-literals': OFF,
      'react/jsx-props-no-spreading': OFF,
      'react/jsx-sort-props': OFF, // Handled by perfectionist
      'react/no-multi-comp': OFF,
      'react/no-unescaped-entities': OFF,
      'perfectionist/sort-jsx-props': OFF,
      'react/require-default-props': [
        ERROR,
        {
          forbidDefaultForRequired: true,
          functions: 'defaultArguments',
        },
      ],
      'unicorn/filename-case': OFF,
      'unicorn/no-keyword-prefix': OFF,
      'unicorn/no-useless-undefined': OFF,
      'perfectionist/sort-modules': OFF,
      'perfectionist/sort-object-types': OFF,
      'perfectionist/sort-exports': OFF,
      'perfectionist/sort-named-imports': OFF,
      'react-hooks/use-memo': OFF,
      'unicorn/prefer-top-level-await': 0, // not valid on RN for the moment
      'unicorn/prevent-abbreviations': [
        ERROR,
        {
          allowList: {
            env: true,
            Param: true,
            props: true,
            Props: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/theme/*.ts'],
    rules: {
      'no-magic-numbers': OFF,
    },
  },
  {
    files: ['*.conf.js', '*.config.js', '*.setup.js'],
    rules: {
      '@typescript-eslint/no-require-imports': OFF,
      '@typescript-eslint/no-unsafe-assignment': OFF,
      '@typescript-eslint/no-unsafe-call': OFF,
      '@typescript-eslint/no-unsafe-member-access': OFF,
      'no-undef': OFF,
      'perfectionist/sort-object-types': OFF,
      'unicorn/prefer-module': OFF,
      'perfectionist/sort-object': OFF,
      'perfectionist/sort-modules': OFF,
    },
  },
  {
    // RTK's getDefaultMiddleware() returns a typed Tuple; .concat() preserves
    // its typing where the spread operator would widen it to a plain array.
    files: ['**/services/store.ts'],
    rules: {
      'unicorn/prefer-spread': OFF,
    },
  },
  {
    files: ['**/*.spec.{js,ts,jsx,tsx}', '**/*.test.{js,ts,jsx,tsx}'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
    },
  },
  {
    ignores: ['plugins/**'],
  },
);
