module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:promise/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'node/no-unpublished-require': 'off',
    'security/detect-non-literal-fs-filename': 'off',
  },
  plugins: ['security', 'promise', 'jest', 'prettier'],
};
