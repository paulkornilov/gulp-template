// SYSTEM/PLUGINS
import pkg from "gulp";
import del from "del";
import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import svgSprite from "gulp-svg-sprite";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import gulpif from "gulp-if";
import browserSync from "browser-sync";

// UTILS
import { detectEnvironment, notification, FILES_ROUTES } from "./utils.js";

const [, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

const NOTIFICATIONS = {
  BROWSER: {
    ASSETS: "Assets compiling...",
  },
  ERROR: {
    ASSETS: "Assets error",
    SVG: "SVG compilation error",
  },
};

/**
 * Deletes everything in "dev/assets/images/webp".
 * This prevents image duplicates.
 */
export const cleanWebpImages = () => {
  return del(FILES_ROUTES.ENTRY.ASSETS.WEBP);
};

/**
 * Generates webp images and places them in "dev/assets/images/webp".
 */
export const generateWebpImages = () => {
  return src(FILES_ROUTES.ENTRY.ASSETS.IMAGES)
    .pipe(webp())
    .pipe(dest(FILES_ROUTES.ENTRY.ASSETS.WEBP));
};

/**
 * Optimizes images and places them with fonts to prod folder.
 */
export const transformAssets = () => {
  notification(NOTIFICATIONS.BROWSER.ASSETS);

  return src(FILES_ROUTES.ENTRY.ASSETS.ROOT)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR.ASSETS,
          message: err.message,
        })),
      }),
    )
    .pipe(gulpif(isProdEnv, imagemin()))
    .pipe(dest(FILES_ROUTES.OUTPUT.ASSETS.ROOT))
    .pipe(
      gulpif(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};

/**
 * Generates sprite of SVG icons in "dev/svg/icons".
 */
export const generateSvgSprite = () => {
  return src(FILES_ROUTES.ENTRY.SVG.ROOT)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR.SVG,
          message: err.message,
        })),
      }),
    )
    .pipe(
      svgSprite({
        svg: {
          xmlDeclaration: false,
        },
        mode: {
          symbol: {
            sprite: "../../svg/sprite.svg",
            prefix: "",
            dimensions: "",
          },
        },
      }),
    )
    .pipe(dest(FILES_ROUTES.OUTPUT.SVG.ROOT))
    .pipe(
      gulpif(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
