import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import gulp from "gulp";
import htmlAutoprefixer from "gulp-html-autoprefixer";
import htmlmin from "gulp-htmlmin";
import newer from "gulp-newer";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import rename from "gulp-rename";
import replace from "gulp-replace";
import sitemap from "gulp-sitemap";
import sourcemaps from "gulp-sourcemaps";
import terser from "gulp-terser";
import postcssNormalize from "postcss-normalize";

// Paths
const paths = {
  src: "./", // Source directory
  dist: "./dist", // Output directory
  html: "./src/pages/**/*.html",
  css: "./src/css/**/*.css",
  js: "./src/scripts/**/*.js",
  assets: "./assets/**",
  public: "./public/**",
};

async function generateCriticalCss() {
  // const { generate } = await import("critical");
  const { stream: critical } = await import("critical");

  return gulp
    .src([
      `${paths.dist}/**/*.html`,
      `!${paths.dist}/lastfm/index.html`,
      `!${paths.dist}/page/index.html`,
    ])
    .pipe(
      critical({
        base: paths.dist,
        inline: true,
        ignore: {
          atrule: ["@font-face"],
        },
        // css: [`${paths.dist}/**/*.css`],
      })
    )
    .on("error", (err) => {
      log.error(err.message);
    })
    .pipe(gulp.dest(paths.dist))
    .on("end", () => {
      console.log("Finished Critical CSS");
    });
}

// Named tasks for processing individual files
function processHtml(filePath) {
  return (
    gulp
      .src(filePath, { base: "./src/pages" })
      .pipe(plumber())
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
      // .on("end", () => {
      //   console.log("Starting Critical CSS");
      //   generateCriticalCss();
      // })
      .pipe(gulp.dest(paths.dist))
  );
}

function processCss(filePath) {
  const plugins = [autoprefixer(), cssnano(), postcssNormalize()];

  return gulp
    .src(filePath, { base: "./src/css" })
    .pipe(plumber())
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
    .pipe(plumber())
    .pipe(newer(paths.dist))
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      replace(/(["'`])(.*?\.js)\1/g, (_match, quote, jsPath) => {
        const updatedPath = jsPath.replace(".js", ".min.js");
        return `${quote}${updatedPath}${quote}`;
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
    .pipe(plumber())
    .pipe(newer(paths.dist))
    .pipe(gulp.dest(paths.dist));
}

function copyPublic(filePath) {
  return gulp
    .src(filePath, { base: "./public", encoding: false })
    .pipe(plumber())
    .pipe(newer(paths.dist))
    .pipe(gulp.dest(paths.dist));
}

function processSitemap(filepath) {
  return gulp
    .src(filepath, { base: "./src/pages", read: false })
    .pipe(
      sitemap({
        siteUrl: "https://lel.nekoweb.org",
        images: true,
      })
    )
    .pipe(gulp.dest(paths.dist));
}

// Watch files for changes
function watchFiles() {
  try {
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
  } catch (error) {
    console.error(error);
  }
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

function buildSitemap() {
  return processSitemap(paths.html);
}

const build = gulp.series(
  gulp.parallel(
    buildHtml,
    buildCss,
    buildJs,
    buildAssets,
    buildPublic,
    buildSitemap
  )
);
const watch = gulp.series(build, watchFiles);

// Export tasks
export { build, watch };
export default build;
