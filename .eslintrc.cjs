module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/no-v-model-argument': 'off',
    'vue/no-multiple-template-root': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off',
    'key-spacing': ['error', { mode: 'strict' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/vite.config.ts'] }
    ],
    'import/extensions': ['error', 'ignorePackages', { ts: 'never' }],
    'no-plusplus': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'consistent-return': 'off',
    'no-return-assign': 'off',
    'vue/no-v-for-template-key': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true }
    ]
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  },
  globals: {
    defineModel: 'readonly'
  }
};
