module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    "plugin:react/jsx-runtime",
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jest',
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "max-len": ["error", { "code": 160 }],
    "react/require-default-props": "off",
    "react/jsx-props-no-spreading": "off",
    "react/forbid-prop-types": "off",
  },
};
