// oiCache.js
const NodeCache = require("node-cache");

const colorsCache = new NodeCache({ stdTTL: 0 });

module.exports = {
  colorsCache,
};
