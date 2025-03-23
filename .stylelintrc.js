/** @type {import('stylelint').Config} */
export default {
  extends: [
    // "stylelint-config-standard",
    "stylelint-config-html/astro",
    "stylelint-config-clean-order",
  ],
  // overrides: [
  //   {
  //     files: ["src/**/*.css"],
  //   },
  // ],
  cache: true,
};
