let  config = require("../../jest.config");

config = Object.assign(config, /** @type {import('ts-jest').JestConfigWithTsJest} */ {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
});
module.exports = config;