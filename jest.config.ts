module.exports = {
  preset: 'jest-playwright-preset',
  testRunner: 'jasmine2',
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
  testTimeout: 60000,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  setupFilesAfterEnv: [
    'jest-allure/dist/setup',
    './customMatchers.ts',
    './config.ts',
  ],
};
