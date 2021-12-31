const autoprefixer = require("autoprefixer");
const sorter = require("css-declaration-sorter");
const combineSelectors = require("postcss-combine-duplicated-selectors");
const mediaQueryPacker = require("node-css-mqpacker");
const sortCSSmq = require("sort-css-media-queries");
const minMaxMedia = require("postcss-media-minmax");

module.exports = {
  plugins: [
    minMaxMedia(),
    require("postcss-preset-env"),
    require("postcss-flexbugs-fixes"),
    require("postcss-discard-duplicates"),
    require("postcss-merge-rules"),
    combineSelectors({ removeDuplicatedProperties: true }),
    mediaQueryPacker({
      sort: sortCSSmq.desktopFirst,
    }),
    autoprefixer({
      cascade: true,
    }),
    sorter({ order: "concentric-css" }),
  ],
};
