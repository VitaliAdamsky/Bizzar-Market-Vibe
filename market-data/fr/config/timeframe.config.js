// timeframe.config.ts
const TIMEFRAME_CONFIG = {
  "2h": { cron: "0 0/2 * * *", delay: 0, ttl: 0 },
};

// Assuming VALID_TIMEFRAMES is an array of timeframe configurations
const VALID_TIMEFRAMES = Object.entries(TIMEFRAME_CONFIG).map(
  ([timeframe, config]) => ({
    timeframe,
    ...config,
  })
);

module.exports = {
  TIMEFRAME_CONFIG,
  VALID_TIMEFRAMES,
};
