const {
  compressToGzipBase64,
  decompressFromGzipBase64,
} = require("@shared/utils/compression-utils.js");

const { frCaches } = require("@fr/cache/store.js");

const {
  TIMEFRAME_CONFIG,
  VALID_TIMEFRAMES,
} = require("@fr/config/timeframe.config.js");

function setFundingRateCache(tf, data) {
  assertTimeframe(tf);

  if (typeof data !== "object") {
    throw new Error("FR CACHE: Data must be a JSON-serializable object.");
  }

  const compressedBuffer = compressToGzipBase64(data);
  frCaches[tf].set("data", compressedBuffer, TIMEFRAME_CONFIG[tf].ttl || 0);
}

function getFundingRateCache(tf) {
  assertTimeframe(tf);
  const buffer = frCaches[tf].get("data");
  if (!buffer) return null;
  const decompressed = decompressFromGzipBase64(buffer);
  return decompressed;
}

function assertTimeframe(tf) {
  if (!frCaches[tf]) {
    throw new Error(
      `Unsupported timeframe "${tf}". Supported: ${VALID_TIMEFRAMES.join(", ")}`
    );
  }
}

module.exports = {
  setFundingRateCache,
  getFundingRateCache,
};
