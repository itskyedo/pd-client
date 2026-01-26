/* eslint sort/object-properties: warn */

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import promisePlugin from 'eslint-plugin-promise';
import sortPlugin from 'eslint-plugin-sort';
import { configs as tseslintConfigs } from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', 'build/', 'node_modules/', './src/_generated/']),
  js.configs.recommended,
  promisePlugin.configs['flat/recommended'],
  sortPlugin.configs['flat/recommended'],
  jsdocPlugin.configs['flat/recommended-typescript'],
  {
    rules: {
      'jsdoc/check-param-names': ['error', { checkDestructured: false }],
      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/require-hyphen-before-param-description': [
        'error',
        'always',
        { tags: { '*': 'always', returns: 'never', yields: 'never' } },
      ],
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': ['error', { checkDestructuredRoots: false }],
      'jsdoc/require-returns': ['error', { checkGetters: false }],
      'jsdoc/tag-lines': ['error', 'always', { count: 0, startLines: 1 }],
    },
  },
  tseslintConfigs.recommendedTypeChecked,
  tseslintConfigs.stylisticTypeChecked,
  {
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/consistent-generic-constructors': [
        'error',
        'type-annotation',
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/dot-notation': [
        'error',
        {
          allowPrivateClassPropertyAccess: true,
          allowProtectedClassPropertyAccess: true,
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['StrictPascalCase'],
          selector: 'typeLike',
        },
        {
          format: ['StrictPascalCase'],
          prefix: ['T'],
          selector: 'typeParameter',
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      'import/consistent-type-specifier-style': ['warn', 'prefer-inline'],
      'import/extensions': ['error', 'always', { ignorePackages: true }],
      'import/no-cycle': 'error',
      'no-warning-comments': 'warn',
      'require-yield': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'off',
      'sort/object-properties': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  eslintConfigPrettier,
);
