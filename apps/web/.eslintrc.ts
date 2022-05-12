module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
  },

  env: {
    browser: true,
    es2021: true,
  },

  plugins: ['prettier', 'react', '@typescript-eslint', 'import'],

  extends: [
    'airbnb-typescript',
    'prettier',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  rules: {
    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    '@typescript-eslint/no-var-requires': ['off'],
  },
}
