const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off',

      // Code quality
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'multi-line'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-throw-literal': 'error',
      'dot-notation': 'error',

      // Async safety
      'no-return-await': 'error',
      'require-await': 'warn',
      'no-promise-executor-return': 'error',

      // Scope safety
      'no-shadow': 'error',

      // Prefer modern syntax
      'prefer-template': 'error',
      'prefer-object-spread': 'error',
      'prefer-regex-literals': 'error',

      // Safety
      'no-implicit-coercion': 'error',
      'no-lonely-if': 'error',
      'no-nested-ternary': 'error',
      'default-case-last': 'error',
      'no-constructor-return': 'error',
    },
  },
  {
    ignores: [
      'node_modules/',
      'coverage/',
      '.smithery/',
      'incoming/',
      'backup_claude/',
    ],
  },
];
