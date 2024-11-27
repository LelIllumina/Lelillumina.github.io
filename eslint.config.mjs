// eslint.config.js
// import prettierConfig from "eslint-config-prettier";
// import prettierPlugin from "eslint-plugin-prettier";
import ermhtml from "eslint-plugin-html";
import html from "@html-eslint/eslint-plugin";

export default [
  {
    ignores: ["dist/**"],
    plugins: {
      ermhtml,
      html,
      // prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    ...html.configs["flat/recommended"],

    settings: {
      // ...prettierConfig, // Apply Prettier configuration
    },

    rules: {
      "no-unused-vars": "warn",
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "@html-eslint/indent": "off",
      "@html-eslint/require-closing-tags": [
        "error",
        {
          selfClosing: "always",
        },
      ], // Enable Prettier as an ESLint rule
      // "prettier/prettier": "error",
    },

    files: ["**/*.html"],
  },
];
