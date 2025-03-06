const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Chemin vers votre application Next.js
  dir: './',
})

// Configuration Jest personnalisée
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
}

module.exports = createJestConfig(customJestConfig) 