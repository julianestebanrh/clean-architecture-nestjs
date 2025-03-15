module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'simple-import-sort',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Reglas de arquitectura limpia
    'import/no-cycle': 'error',
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        'pathGroups': [
          {
            'pattern': '@domain/**',
            'group': 'internal',
            'position': 'before'
          },
          {
            'pattern': '@application/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@infrastructure/**',
            'group': 'internal',
            'position': 'after'
          },
          {
            'pattern': '@webapi/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['builtin'],
        'newlines-between': 'always'
      }
    ],
    
    // Reglas generales
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn',
    
    // Reglas específicas para DDD
    'max-classes-per-file': ['error', 1],
    'no-param-reassign': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { overrides: { constructors: 'no-public' } }
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};