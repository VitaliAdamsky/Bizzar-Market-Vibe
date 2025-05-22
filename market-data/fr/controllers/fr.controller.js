const { getFundingRateCache } = require("@fr/cache/service.js");

const {
  initializeFundingRateStore,
} = require("@fr/functions/initialize-fr-store.js");

const { VALID_TIMEFRAMES } = require("@fr/config/timeframe.config.js");

async function getFundingRateDataController(req, res, next) {
  try {
    const config = VALID_TIMEFRAMES[0];
    const timeframe = config.timeframe;
    const data = getFundingRateCache(timeframe);
    // Set headers for JSON response
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "max-age=60");

    // Send the decompressed JSON data
    res.json(data);
  } catch (err) {
    console.error("Error fetching kline data:", err);
    return next(err);
  }
}

async function refreshFundingRateStoreController(req, res, next) {
  try {
    await initializeFundingRateStore(limit);
    // 3) Return coins array as JSON
    return res.status(200).json({ message: "OI store refreshed" });
  } catch (err) {
    // 4) On error, reset cache to avoid stale data
    console.error("Error fetching open interest:", err);
    // Delegate error handling to Express
    return next(err);
  }
}

module.exports = {
  getFundingRateDataController,
  refreshFundingRateStoreController,
};
