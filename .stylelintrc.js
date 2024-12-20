/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html",
    "stylelint-config-clean-order",
  ],
  overrides: [
    {
      files: ["src/**/*.css"],
    },
  ],
  cache: true,
};
