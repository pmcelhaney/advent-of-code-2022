"use strict";

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  extends: ["plugin:@walgreenshealth/recommended"],

  ignorePatterns: [
    "**/node_modules/**",
    "**/coverage/**",
    "**/reports/**",
    "**/.stryker-tmp/**",
  ],

  rules: {
    "no-magic-numbers": "off",
  },

  overrides: [
    {
      files: ["**/*.cjs"],

      parserOptions: {
        sourceType: "script",
      },

      env: {
        node: true,
      },

      rules: {
        "import/no-commonjs": "off",
      },
    },
  ],

  plugins: ["@walgreenshealth/eslint-plugin"],
};
