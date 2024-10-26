import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
  {
    ignores: ["**/*.min.js"],
  },
  pluginJs.configs.recommended,
  {
    parserOptions: {
      sourceType: "module",
    },
  },
];
