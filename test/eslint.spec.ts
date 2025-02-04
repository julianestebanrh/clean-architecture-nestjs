import { execSync } from 'child_process';

describe('Linting Rules', () => {
  it('should pass all ESLint rules', () => {
    expect(() => {
      execSync('npx eslint "src/**/*.ts"');
    }).not.toThrow();
  });
});