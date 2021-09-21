/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: [
    "dist/**/*.js"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      statements: 90,
      lines: 90,
      functions: 90
    }
  },
  displayName: "lib/js",
  roots: [
    "test"
  ]
}
