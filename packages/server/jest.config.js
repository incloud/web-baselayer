module.exports = {
  verbose: false,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/test/unit/**/*.ts',
    '<rootDir>/test/functional/**/*.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: './',
  roots: ['<rootDir>/test', '<rootDir>/src'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/browser-shim.ts',
    '!<rootDir>/src/**/fooByUserLoader.ts'
  ],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
};
