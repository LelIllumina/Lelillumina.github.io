import gulp from "gulp";
import htmlmin from "gulp-htmlmin";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import replace from "gulp-replace";
import newer from "gulp-newer";

// Paths
const paths = {
  src: "./", // Source directory
  dist: "./dist", // Output directory
  html: ["./**/*.html", "!./node_modules/**", "!./dist/**"],
  css: ["./**/*.css", "!./node_modules/**", "!./dist/**"],
  js: ["./**/*.js", "!./node_modules/**", "!./dist/**", "!./gulpfile.js"],
  assets: [
    "./**/*.{png,avif,jxl,jpg,jpeg,gif,svg,webp,ttf,woff,woff2,eot,otf,ico,cur,mp4}",
    "./public/**",
    "!./node_modules/**",
    "!./dist/**",
  ],
};

// Named tasks for processing individual files
function processHtml(filePath) {
  return gulp
    .src(filePath, { base: paths.src })
    .pipe(newer(paths.dist))
    .pipe(
      replace(
        /(<link.*?href=")(.*?\.css)(".*?>)/g,
        (match, start, cssPath, end) => {
          if (!/^https?:\/\//i.test(cssPath)) {
            const minifiedPath = cssPath.replace(".css", ".min.css");
            return `${start}${minifiedPath}${end}`;
          }
          return match;
        }
      )
    )
    .pipe(
      replace(
        /(<script.*?src=")(.*?\.js)(".*?>)/g,
        (match, start, jsPath, end) => {
          if (!/^https?:\/\//i.test(jsPath)) {
            const minifiedPath = jsPath.replace(".js", ".min.js");
            return `${start}${minifiedPath}${end}`;
          }
          return match;
        }
      )
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: "https://lel.nekoweb.org/",
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    )
    .pipe(gulp.dest(paths.dist));
}

function processCss(filePath) {
  return gulp
    .src(filePath, { base: paths.src })
    .pipe(newer(paths.dist))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(filePath, { base: paths.src }))
    .pipe(gulp.dest(paths.dist));
}

function processJs(filePath) {
  return gulp
    .src(filePath, { base: paths.src })
    .pipe(newer(paths.dist))
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
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(filePath, { base: paths.src }))
    .pipe(gulp.dest(paths.dist));
}

function processAssets(filePath) {
  return gulp
    .src(filePath, { base: paths.src, encoding: false })
    .pipe(newer(paths.dist))
    .pipe(gulp.dest(paths.dist));
}

// Watch files for changes
function watchFiles() {
  gulp.watch(paths.html).on("change", (path) => {
    processHtml(path);
  });

  gulp.watch(paths.css).on("change", (path) => {
    processCss(path);
  });

  gulp.watch(paths.js).on("change", (path) => {
    processJs(path);
  });

  gulp.watch(paths.assets).on("change", (path) => {
    processAssets(path);
  });
}

// Define build task
function buildHtml() {
  return processHtml(paths.html);
}

function buildCss() {
  return processCss(paths.css);
}

function buildJs() {
  return processJs(paths.js);
}

function buildAssets() {
  return processAssets(paths.assets);
}

const build = gulp.series(
  gulp.parallel(buildHtml, buildCss, buildJs, buildAssets)
);
const watch = gulp.series(build, watchFiles);

// Export tasks
export { build, watch };
export default build;
