// SYSTEM/PLUGINS
import pkg from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import gulpif from "gulp-if";

// UTILS
import { detectEnvironment, notification, FILES_ROUTES } from "./utils.js";

const [envMode, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

const NOTIFICATIONS = {
  BROWSER: "JavaScript compiling...",
  ERROR: "JavaScript error",
};

/**
 * Compiles JS with webpack + optimizes it and places it into prod folder.
 */
export const compileJS = () => {
  notification(NOTIFICATIONS.BROWSER);

  return src(FILES_ROUTES.ENTRY.JS.ROOT)
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: NOTIFICATIONS.ERROR,
          message: err.message,
        })),
      }),
    )
    .pipe(
      webpackStream({
        mode: envMode,
        devtool: isProdEnv ? "(none)" : "source-map",
        output: {
          filename: "[name].js",
        },
        optimization: {
          minimize: true,
          splitChunks: {
            cacheGroups: {
              main: {
                name: "main",
                test: /[\\/]dev[\\/]/,
                chunks: "all",
                enforce: true,
              },
              vendor: {
                name: "libs.min",
                test: /[\\/](node_modules)[\\/](((?!(core-js)).*)|vendor)[\\/]/,
                chunks: "all",
                enforce: true,
              },
              polyfills: {
                name: "polyfills.min",
                test: /[\\/]node_modules[\\/]((core-js).*)[\\/]/,
                chunks: "all",
                enforce: true,
              },
            },
          },
        },
        module: isProdEnv
          ? {
              rules: [
                {
                  test: /\.js$/,
                  loader: "babel-loader",
                  exclude: /(([\\/]node_modules[\\/])|([\\/]dev[\\/]vendor))/,
                },
              ],
            }
          : {},
      }),
      webpack,
    )
    .pipe(dest(FILES_ROUTES.OUTPUT.JS.ROOT))
    .pipe(
      gulpif(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
