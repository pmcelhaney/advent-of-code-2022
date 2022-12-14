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
    "max-statements": "off",
    "no-plusplus": "off",
    "no-console": "warn",
    "max-params": "off",
    "no-continue": "off",
  },

  env: {
    es2022: true,
    node: true,
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
