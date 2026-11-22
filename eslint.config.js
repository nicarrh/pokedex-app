// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

const inner = ['src/features/*/domain/**', 'src/features/*/application/**'];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'ios/', 'android/', '.expo/', 'coverage/'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: inner,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['react', 'react-native', 'expo-*', 'react-native-mmkv', '**/adapters/**'],
        },
      ],
    },
  },
  {
    files: ['src/features/*/adapters/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '**/adapters/api/**',
            '**/adapters/cache/**',
            'react-native-mmkv',
            'expo-secure-store',
          ],
        },
      ],
    },
  },
  prettierRecommended,
]);
