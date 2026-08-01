module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint'],
  extends: ['next', 'next/core-web-vitals', 'prettier'],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    'no-console': 'warn',
    // Disable base rule in favour of the TypeScript-aware version so that
    // function type parameters (e.g. in interfaces) are not flagged.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
  ignorePatterns: ['node_modules', '.next', 'out'],
}
