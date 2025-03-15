const baseConfig = require('../jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/*.e2e-spec.ts'],
  coverageDirectory: 'coverage-e2e',
  setupFilesAfterEnv: ['<rootDir>/tests/jest-e2e.setup.ts'],
}; 