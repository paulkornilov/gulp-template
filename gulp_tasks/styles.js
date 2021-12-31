// SYSTEM/PLUGINS
import pkg from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import sass from "gulp-dart-sass";
import sourcemaps from "gulp-sourcemaps";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import gulpif from "gulp-if";
import postcss from "gulp-postcss";

// UTILS
import { detectEnvironment, notification, FILES_ROUTES } from "./utils.js";

const [, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

const NOTIFICATIONS = {
  BROWSER: {
    MAIN: "CSS compiling...",
    LIBS: "CSS libs compiling",
  },
  ERROR: {
    MAIN: "CSS error",
    LIBS: "CSS libs error",
  },
};

/**
 * SASS compilation + PostCSS optimizations and transformations for main SCSS files.
 */
export const compileCSS = () => {
  notification(NOTIFICATIONS.BROWSER.MAIN);

  return src(FILES_ROUTES.ENTRY.SCSS.MAIN)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR.MAIN,
          message: err.message,
        })),
      }),
    )
    .pipe(gulpif(isDevEnv, sourcemaps.init()))
    .pipe(sass())
    .pipe(postcss())
    .pipe(gulpif(isProdEnv, cleanCSS()))
    .pipe(gulpif(isDevEnv, sourcemaps.write()))
    .pipe(dest(FILES_ROUTES.OUTPUT.SCSS.ROOT))
    .pipe(gulpif(isDevEnv, browserSync.stream()));
};

/**
 * SASS compilation + PostCSS optimizations and transformations for libs SCSS files.
 */
export const compileCSSLibs = () => {
  notification(NOTIFICATIONS.BROWSER.LIBS);

  return src(FILES_ROUTES.ENTRY.SCSS.LIBS)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR.LIBS,
          message: err.message,
        })),
      }),
    )
    .pipe(gulpif(isDevEnv, sourcemaps.init()))
    .pipe(sass())
    .pipe(gulpif(isProdEnv, postcss()))
    .pipe(gulpif(isProdEnv, cleanCSS()))
    .pipe(gulpif(isDevEnv, sourcemaps.write()))
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(dest(FILES_ROUTES.OUTPUT.SCSS.ROOT))
    .pipe(gulpif(isDevEnv, browserSync.stream()));
};
