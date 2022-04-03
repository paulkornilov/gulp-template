// IMPORTS
import pkg from "gulp";
import notify from "gulp-notify";
import pug from "gulp-pug";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import gulpIf from "gulp-if";

// UTILS
import { detectEnvironment, showNotification } from "./utils.js";

const [, , isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

// Transform PUG into HTML and places it into prod folder.
export const compilePug = () => {
  showNotification("PUG compiling...");

  return src([
    "dev/pug/pages/*.pug",
    "!dev/pug/layout/*.pug",
    "!dev/pug/partials/_*.pug",
    "!dev/pug/mixins/*.pug",
  ])
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "PUG error",
          message: err.message,
        })),
      }),
    )
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(dest("prod/"))
    .pipe(
      gulpIf(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
