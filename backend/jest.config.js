const tsPreset = require('ts-jest/jest-preset')
const mongoPreset = require('@shelf/jest-mongodb/jest-preset')

module.exports = {
  ...tsPreset,
  // ...mongoPreset,
  testEnvironment: 'node',
  // preset: '@shelf/jest-mongodb',
  // setupFiles: ['./start-script.js'],
  // globalTeardown: './teardown.js',
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
