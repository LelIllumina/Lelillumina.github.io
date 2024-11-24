import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import gulp from "gulp";
import htmlAutoprefixer from "gulp-html-autoprefixer";
import htmlmin from "gulp-htmlmin";
import newer from "gulp-newer";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import replace from "gulp-replace";
import sourcemaps from "gulp-sourcemaps";
import terser from "gulp-terser";
import postcssNormalize from "postcss-normalize";

// Paths
const paths = {
  src: "./", // Source directory
  dist: "./dist", // Output directory
  html: ["./src/pages/**/*.html", "!./node_modules/**", "!./dist/**"],
  css: ["./src/css/**/*.css", "!./node_modules/**", "!./dist/**"],
  js: [
    "./src/scripts/**/*.js",
    "!./node_modules/**",
    "!./dist/**",
    "!./gulpfile.js",
  ],
  assets: ["./assets/**", "!./node_modules/**", "!./dist/**"],
  public: "./public/**",
};

// Named tasks for processing individual files
function processHtml(filePath) {
  return gulp
    .src(filePath, { base: "./src/pages" })
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
    .pipe(htmlAutoprefixer())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        // minifyURLs: "https://lel.nekoweb.org/",
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      })
    )
    .pipe(gulp.dest(paths.dist));
}

function processCss(filePath) {
  const plugins = [autoprefixer(), cssnano(), postcssNormalize()];

  return gulp
    .src(filePath, { base: "./src/css" })
    .pipe(newer(paths.dist))
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(filePath, { base: "./src/css" }))
    .pipe(gulp.dest(paths.dist));
}

function processJs(filePath) {
  return gulp
    .src(filePath, { base: "./src/scripts" })
    .pipe(newer(paths.dist))
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      replace(/(\.\/|\.\.\/)(.*?\.js)/g, (prefix, jsPath) => {
        const updatedPath = jsPath.replace(".js", ".min.js");
        return `${prefix}${updatedPath}`;
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulp.src(filePath, { base: "./src/scripts" }))
    .pipe(gulp.dest(paths.dist));
}

function processAssets(filePath) {
  return gulp
    .src(filePath, { base: "./", encoding: false })
    .pipe(newer(paths.dist))
    .pipe(gulp.dest(paths.dist));
}

function copyPublic(filePath) {
  return gulp
    .src(filePath, { base: "./public", encoding: false })
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

function buildPublic() {
  return copyPublic(paths.public);
}

const build = gulp.series(
  gulp.parallel(buildHtml, buildCss, buildJs, buildAssets, buildPublic)
);
const watch = gulp.series(build, watchFiles);

// Export tasks
export { build, watch };
export default build;

// so the idea is that i make a src folder and put all kindas pages and css in it
// but i keep the nested folder names the same so i can make gulp copy 1:1 from each folder
// and its nicer over here
