module.exports = {
  extends: ['eslint-config-airbnb', 'plugin:react/recommended', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'no-use-before-define': ['off', { variables: true, functions: true }],
    'no-param-reassign': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'warn',
  },
};
