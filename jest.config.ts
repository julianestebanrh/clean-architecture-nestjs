// import { Config } from 'jest';

// const config: Config = {
//   rootDir: './',
//   testMatch: ['<rootDir>/tests/**/*.spec.ts'], // Define la ubicación de los tests
//   transform: {
//     '^.+\\.ts$': 'ts-jest',
//   },
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'js'],
//   moduleNameMapper: {
//     '^src/(.*)$': '<rootDir>/src/$1',
//   },
// };

// export default config;


import { Config } from 'jest';

const config: Config = {
  rootDir: './',
  testMatch: ['<rootDir>/test/**/*.spec.ts'], // Carpeta de tests fuera de src
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'src'], // Para importar sin alias
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'js'],
};

export default config;