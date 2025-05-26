module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/controllers/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};