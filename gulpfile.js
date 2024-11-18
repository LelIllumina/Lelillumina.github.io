const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const replace = require("gulp-replace");
const newer = require("gulp-newer");

// Paths
const paths = {
  src: "./", // Source directory
  dist: "./dist", // Output directory
  html: ["./**/*.html", "!./node_modules/**"],
  css: ["./**/*.css", "!./node_modules/**"],
  js: ["./**/*.js", "!./node_modules/**"],
  assets: [
    "./**/*.{png,avif,jxl,jpg,jpeg,gif,svg,webp,ttf,woff,woff2,eot,otf,ico}",
    "!./node_modules/**",
  ],
};

// Minify HTML and update CSS/JS links
function minifyHtml() {
  return gulp
    .src(paths.html, { base: paths.src })
    .pipe(
      replace(
        /(<link.*?href=")(.*?\.css)(".*?>)/g,
        (match, start, cssPath, end) => {
          const minifiedPath = cssPath.replace(".css", ".min.css");
          return `${start}${minifiedPath}${end}`;
        }
      )
    )
    .pipe(
      replace(
        /(<script.*?src=")(.*?\.js)(".*?>)/g,
        (match, start, jsPath, end) => {
          const minifiedPath = jsPath.replace(".js", ".min.js");
          return `${start}${minifiedPath}${end}`;
        }
      )
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest(paths.dist));
}

// Minify CSS
function minifyCss() {
  return gulp
    .src(paths.css, { base: paths.src, since: gulp.lastRun(minifyCss) })
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist)) // Output minified CSS
    .pipe(gulp.src(paths.css, { base: paths.src })) // Include original CSS files
    .pipe(gulp.dest(paths.dist)); // Output original CSS
}

// Minify JS and update module imports
function minifyJs() {
  return gulp
    .src(paths.js, { base: paths.src, since: gulp.lastRun(minifyJs) })
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      replace(/(\.\/|\.\.\/)(.*?\.js)/g, (match, prefix, jsPath) => {
        const updatedPath = jsPath.replace(".js", ".min.js");
        return `${prefix}${updatedPath}`;
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist)) // Output minified JS
    .pipe(gulp.src(paths.js, { base: paths.src })) // Include original JS files
    .pipe(gulp.dest(paths.dist)); // Output original JS
}

// Copy assets (images, fonts, etc.) only if they are newer or missing
function copyAssets() {
  return gulp
    .src(paths.assets, {
      base: paths.src,
      encoding: false,
      since: gulp.lastRun(copyAssets),
    })
    .pipe(newer(paths.dist)) // Check if the file is newer or missing in the destination
    .pipe(gulp.dest(paths.dist)); // Copy the file if it's new or updated
}

// Watch files for changes
function watchFiles() {
  gulp.watch(paths.html, minifyHtml);
  gulp.watch(paths.css, minifyCss);
  gulp.watch(paths.js, minifyJs);
  gulp.watch(paths.assets, copyAssets);
}

const { series, parallel } = gulp;

// Gulp tasks
exports.build = series(parallel(minifyHtml, minifyCss, minifyJs, copyAssets));
exports.watch = series(exports.build, watchFiles);
exports.default = exports.build;
