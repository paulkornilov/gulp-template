// IMPORTS
import pkg from "gulp";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import gulpIf from "gulp-if";

// UTILS
import { detectEnvironment, showNotification } from "./utils.js";

const [envMode, isProdEnv, isDevEnv] = detectEnvironment();
const { src, dest } = pkg;

/**
 * Compiles JS with webpack + optimizes it and places it into prod folder.
 */
export const compileJS = () => {
  showNotification("JavaScript compiling...");

  return src("dev/index.js")
    .pipe(
      plumber({
        error_task: notify.onError((err) => ({
          title: "JavaScript compilation error",
          message: err.message,
        })),
      }),
    )
    .pipe(
      webpackStream({
        mode: envMode,
        devtool: isProdEnv ? false : "source-map",
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
    .pipe(dest("prod/js"))
    .pipe(
      gulpIf(
        isDevEnv,
        browserSync.reload({
          stream: true,
        }),
      ),
    );
};
