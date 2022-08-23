const config = {
  verbose: true,
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.ts', '!src/types.ts'],
}

module.exports = config
