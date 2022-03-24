module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // "extends": "eslint:recommended",
  extends: ['airbnb-base', 'eslint-config-prettier'],
  plugins: ['eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'prettier/prettier': 'error',
  },
};
