// IMPORTS
import pkg from "gulp";
import del from "del";
import size from "gulp-size";
import notify from "gulp-notify";
import styleGuide from "postcss-style-guide";
import postcss from "gulp-postcss";
import browserSync from "browser-sync";
import { readFile } from "fs/promises";

const packageJSON = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
const { src } = pkg;

export const clean = () => {
  return del(["prod/*", "dev/svg/sprite.svg"]);
};

export const cleanProd = () => {
  return del(["prod/*"]);
};

export const cssSize = () => {
  const gulpSize = size();

  return src("prod/css/*.css")
    .pipe(gulpSize)
    .pipe(
      notify({
        onLast: true,
        message: () => `Total CSS bundle size ${gulpSize.prettySize}`,
      }),
    );
};

export const jsSize = () => {
  const gulpSize = size();

  return src("prod/js/*.js")
    .pipe(gulpSize)
    .pipe(
      notify({
        onLast: true,
        message: () => `Total JavaScript bundle size ${gulpSize.prettySize}`,
      }),
    );
};

export const generateStyleguide = () => {
  return src(["prod/css/*.css", "!prod/css/libs.min.css"]).pipe(
    postcss([
      styleGuide({
        project: `${packageJSON.name ?? "Template"}`,
        dest: "styleguide/index.html",
        showCode: true,
      }),
    ]),
  );
};

export const runWebserver = () => {
  browserSync({
    server: {
      baseDir: "prod",
    },
    notify: true,
  });
};
