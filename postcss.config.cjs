const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const sorter = require("css-declaration-sorter");
const mediaQueryPacker = require("node-css-mqpacker");
const sortCSSmq = require("sort-css-media-queries");
const minMaxMedia = require("postcss-media-minmax");

module.exports = {
  plugins: [
    minMaxMedia(),
    postcssPresetEnv({ stage: 3 }),
    require("postcss-flexbugs-fixes"),
    require("postcss-discard-duplicates"),
    require("postcss-merge-rules"),
    mediaQueryPacker({
      sort: sortCSSmq.desktopFirst,
    }),
    autoprefixer({
      cascade: true,
      supports: false,
    }),
    sorter({ order: "concentric-css" }),
  ],
};
