module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "controllers/auth.controller.js",
    "controllers/child.controller.js",
    "controllers/reading.controller.js",
    "middleware/protect.js",
    "models/**/*.js",
    "routes/routes.js",

    "!**/*.{cjs}",
    "!**/node_modules/**",
    "!**/tests/**",
    "!jest.config.cjs",
    "!server.js",
    "!**/seeders/**",
    "!**/helper/**",
    "!**/coverage/**",
  ],
};
