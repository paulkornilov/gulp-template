// IMPORTS
import pkg from "gulp";
import del from "del";
import size from "gulp-size";
import notify from "gulp-notify";
import browserSync from "browser-sync";

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

export const runWebserver = () => {
  browserSync({
    server: {
      baseDir: "prod",
    },
    notify: true,
  });
};
