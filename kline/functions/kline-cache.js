const NodeCache = require("node-cache");
const {
  compressToGzipBase64,
  decompressFromGzipBase64,
} = require("@shared/utility/compression-utils.js");
const { isJsonSerializable } = require("@shared/utility/is-json-format.js");

const TTL = { "1h": 0, "4h": 0, "12h": 0, D: 0 };

const klineCaches = Object.fromEntries(
  Object.entries(TTL).map(([tf, ttl]) => [tf, new NodeCache({ stdTTL: 0 })])
);

const VALID = Object.keys(klineCaches);

function assertTimeframe(tf) {
  if (!klineCaches[tf])
    throw new Error(
      `Unsupported timeframe "${tf}". Supported: ${VALID.join(", ")}`
    );
}

// Store gzip Buffer
function setKlineCache(tf, data) {
  assertTimeframe(tf);
  if (!isJsonSerializable(data)) {
    throw new Error("Data is not JSON serializable");
  }
  console.log("setKlineCache", tf, data.data.length);
  const compressedBuffer = compressToGzipBase64(data);
  // ✅ Validate decompression integrity
  try {
    const test = decompressFromGzipBase64(compressedBuffer);
    if (JSON.stringify(test) !== JSON.stringify(data)) {
      throw new Error("Decompressed data mismatch");
    }
  } catch (err) {
    throw new Error("Compressed buffer is invalid or corrupt: " + err.message);
  }

  klineCaches[tf].set("data", compressedBuffer, TTL[tf] || 0);
  console.log("Setting cache for:", tf);
  console.log("Buffer length:", compressedBuffer.length);
}

// Decompress gzip buffer to JS
function getKlineCache(tf) {
  assertTimeframe(tf);
  const buffer = klineCaches[tf].get("data");
  if (!buffer) return null;
  try {
    const decompressed = decompressFromGzipBase64(buffer);
    console.log("HELL:getKlineCache", tf, decompressed.data.length);
    return buffer;
  } catch (err) {
    console.error("Failed to decompress kline data:", err);
    return null;
  }
}

module.exports = {
  VALID_TIMEFRAMES: VALID,
  setKlineCache,
  getKlineCache,
};
