// IMPORTS
import pkg from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import sass from "gulp-dart-sass";
import sourcemaps from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import gulpIf from "gulp-if";
import postcss from "gulp-postcss";

// UTILS
import { detectEnvironment, showNotification } from "./utils.js";

const [, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

/**
 * SASS compilation + PostCSS optimizations and transformations for main SCSS files.
 */
export const compileCSS = () => {
  showNotification("CSS compiling...");

  return src(["dev/scss/**/*.scss", "!dev/scss/**/_*.scss", "!dev/scss/libs*.scss"])
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "CSS compilation error",
          message: err.message,
        })),
      }),
    )
    .pipe(gulpIf(isDevEnv, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss())
    .pipe(gulpIf(isProdEnv, cleanCSS()))
    .pipe(gulpIf(isDevEnv, sourcemaps.write()))
    .pipe(dest("prod/css"))
    .pipe(gulpIf(isDevEnv, browserSync.stream()));
};

/**
 * SASS compilation + PostCSS optimizations and transformations for libs SCSS files.
 */
export const compileCSSLibs = () => {
  showNotification("CSS libs compiling");

  return src("dev/scss/libs*.scss")
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "CSS libs compilation error",
          message: err.message,
        })),
      }),
    )
    .pipe(gulpIf(isDevEnv, sourcemaps.init()))
    .pipe(sass())
    .pipe(gulpIf(isProdEnv, postcss()))
    .pipe(gulpIf(isProdEnv, cleanCSS()))
    .pipe(gulpIf(isDevEnv, sourcemaps.write()))
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(dest("prod/css"))
    .pipe(gulpIf(isDevEnv, browserSync.stream()));
};
