const {
  validateRequestParams,
} = require("@shared/validators/validate-request-params.js");

const { getKlineCache } = require("@kline/functions/kline-cache.js");

const {
  initializeKlineStore,
} = require("@kline/functions/initialize-kline-store.js");

const {
  decompressFromGzipBase64,
} = require("@shared/utility/compression-utils.js");

async function getKlineDataController(req, res, next) {
  try {
    const { timeframe } = validateRequestParams(req.query);
    console.log("CONTROLLER timeframe", timeframe);

    const compressedBuffer = getKlineCache(timeframe);
    if (!compressedBuffer) {
      return res.status(404).json({ error: "No data for this timeframe" });
    }

    let decompressed;
    try {
      decompressed = decompressFromGzipBase64(compressedBuffer);
      console.log("HELL:getKlineCache", timeframe, decompressed.data.length);
    } catch (err) {
      console.error("Failed to decompress kline data:", err);
      return res.status(500).json({ error: "Failed to decompress kline data" });
    }

    // Set headers for JSON response
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "max-age=60");

    // Send the decompressed JSON data
    res.json(decompressed);
  } catch (err) {
    console.error("Error fetching kline data:", err);
    return next(err);
  }
}

async function refreshKlineStoreController(req, res, next) {
  try {
    const { limit } = validateRequestParams(req.query);

    await initializeKlineStore(limit);

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
  getKlineDataController,
  refreshKlineStoreController,
};
