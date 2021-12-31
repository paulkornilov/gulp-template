// SYSTEM/PLUGINS
import pkg from "gulp";
import notify from "gulp-notify";
import pug from "gulp-pug";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import gulpif from "gulp-if";

// UTILS
import { detectEnvironment, notification, FILES_ROUTES } from "./utils.js";

const [, , isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

const NOTIFICATIONS = {
  BROWSER: "PUG compiling...",
  ERROR: "PUG error",
};

/**
 * Transform PUG into HTML and places it into prod folder.
 */
export const compilePug = () => {
  notification(NOTIFICATIONS.BROWSER);

  return src(FILES_ROUTES.ENTRY.PUG.ROOT)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR,
          message: err.message,
        })),
      }),
    )
    .pipe(
      pug({
        pretty: true,
      }),
    )
    .pipe(dest(FILES_ROUTES.OUTPUT.PUG.ROOT))
    .pipe(
      gulpif(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
