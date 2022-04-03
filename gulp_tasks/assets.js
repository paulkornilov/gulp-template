// IMPORTS
import pkg from "gulp";
import imagemin from "gulp-imagemin";
import svgSprite from "gulp-svg-sprite";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import gulpIf from "gulp-if";
import browserSync from "browser-sync";

// UTILS
import { detectEnvironment, showNotification } from "./utils.js";

const [, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

/**
 * Optimizes images and places them with fonts to prod folder.
 */
export const transformAssets = () => {
  showNotification("Assets compiling...");

  return src("dev/assets/**/*.*")
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "Assets compilation error",
          message: err.message,
        })),
      }),
    )
    .pipe(gulpIf(isProdEnv, imagemin()))
    .pipe(dest("prod/assets/"))
    .pipe(
      gulpIf(
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
  return src("dev/svg/icons/*.svg")
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "SVG compilation error",
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
    .pipe(dest("dev/svg"))
    .pipe(
      gulpIf(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
