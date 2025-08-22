module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,cjs}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/tests/**",
    "!jest.config.cjs",
  ],
};
