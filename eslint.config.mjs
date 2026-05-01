// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    files: ['src/api/controllers/**/*.ts', 'src/api/modules/**/controllers/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/repositories/**', '**/*.repository.ts'],
              message:
                'Controllers must depend on application services only, not repositories.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/api/modules/auth/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/api/repositories/user/**',
                '**/repositories/user/**',
              ],
              message:
                'Auth must use UserAccountService (UserModule) instead of UserRepository.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/common/guards/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/api/services/**'],
              message:
                'Guards under common/guards must not import api/services; use module-local guards (see api/modules/permission).',
            },
          ],
        },
      ],
    },
  },
);
