import pkg from "gulp";
const { series, parallel, watch } = pkg;

import * as SYSTEM from "./gulp_tasks/system.js";
import * as STYLES from "./gulp_tasks/styles.js";
import * as SCRIPTS from "./gulp_tasks/scripts.js";
import * as MARKUP from "./gulp_tasks/markup.js";
import * as ASSETS from "./gulp_tasks/assets.js";

// +-----------------------+
// | Gulp tasks            |
// +-----------------------+

const watcher = () => {
  watch(
    ["dev/scss/**/*.scss", "!dev/scss/libs*.scss", "dev/components/**/*.scss"],
    STYLES.compileCSS,
  );
  watch("dev/scss/libs*.scss", STYLES.compileCSSLibs);
  watch(["dev/pug/**/*.pug", "dev/components/**/*.pug"], MARKUP.compilePug);
  watch("dev/components/**/*.js", SCRIPTS.compileJS);
  watch("dev/assets/**/*.*", ASSETS.transformAssets);
  watch("dev/svg/icons/*.*", series(ASSETS.generateSvgSprite, MARKUP.compilePug));
};

export const build = series(
  ASSETS.generateSvgSprite,
  parallel(MARKUP.compilePug, SCRIPTS.compileJS, STYLES.compileCSS, STYLES.compileCSSLibs),
  ASSETS.transformAssets,
);

// Generates WEBP
export const webp_task = series(ASSETS.cleanWebpImages, ASSETS.generateWebpImages);
// Generates JSON with CSS analysis
export const css_analyze = SYSTEM.analyzeCSS;
// Generates CSS style guide
export const styleguide = SYSTEM.generateStyleguide;
// Shows final sizes of JS and CSS files in prod folder
export const size = series(SYSTEM.cssSize, SYSTEM.jsSize);
// Cleans prod, analysis, and SVG sprite
export const clean = SYSTEM.clean;
// Cleans only prod folder
export const cleanProd = SYSTEM.cleanProd;

export default series(
  series(
    ASSETS.generateSvgSprite,
    parallel(
      ASSETS.transformAssets,
      MARKUP.compilePug,
      STYLES.compileCSS,
      STYLES.compileCSSLibs,
      SCRIPTS.compileJS,
    ),
  ),
  parallel(SYSTEM.runWebserver, watcher),
);
