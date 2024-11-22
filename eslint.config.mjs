// eslint.config.js
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["**/*.min.js"], // Ignore all minified JavaScript files

    plugins: {
      prettier: prettierPlugin, // Register the Prettier plugin
    },

    rules: {
      "no-unused-vars": "warn", // Warn for variables that are declared but not used
      eqeqeq: "error", // Enforce strict equality `===` and `!==`
      "no-var": "error", // Disallow `var`, encourage `let` and `const`
      "prefer-const": "warn", // Suggest `const` if a variable is never reassigned
      semi: ["error", "always"], // Enforce semicolons at the end of statements
      quotes: ["error", "double"], // Enforce single quotes for strings
      // indent: ["error", 2], // Enforce 2-space indentation
      "no-multiple-empty-lines": ["error", { max: 1 }], // Limit empty lines

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
