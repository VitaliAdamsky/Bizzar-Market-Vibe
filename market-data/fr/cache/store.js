const NodeCache = require("node-cache");

//const { TTL } = require("@kline/cache/ttl.js");
const { TIMEFRAME_CONFIG } = require("@fr/config/timeframe.config.js");

const frCaches = Object.fromEntries(
  Object.entries(TIMEFRAME_CONFIG).map(([tf, config]) => [
    tf,
    new NodeCache({ stdTTL: config.ttl }),
  ])
);

module.exports = {
  frCaches,
};
