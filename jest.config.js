const config = {
  verbose: true,
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  collectCoverage: true,
  setupFiles: ['<rootDir>/jest.setEnv.js']
};

module.exports = config;
