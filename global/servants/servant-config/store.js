const NodeCache = require("node-cache");

const servantConfigCache = new NodeCache({ stdTTL: 0 });

module.exports = {
  servantConfigCache,
};
