// eslint.config.js
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["dist/**"],
    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "no-unused-vars": "warn",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-multiple-empty-lines": ["error", { max: 1 }],

      // Enable Prettier as an ESLint rule
      "prettier/prettier": "error",
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      ...prettierConfig, // Apply Prettier configuration
    },
  },
];
