const NodeCache = require("node-cache");
const {
  compressToBase64,
  decompressFromBase64,
} = require("../../functions/shared/utility/compression-utils.js"); // Adjust path if needed

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

// Stores compressed base64 version
function setKlineCache(tf, data) {
  assertTimeframe(tf);
  const compressed = compressToBase64(data);
  klineCaches[tf].set("data", compressed, TTL[tf] || 0);
}

// Decompresses and returns parsed data
function getKlineCache(tf) {
  assertTimeframe(tf);
  const compressed = klineCaches[tf].get("data");
  if (!compressed) return null;
  return decompressFromBase64(compressed);
}

// Returns raw base64 compressed string (for network send/log/etc)
function getCompressedKlineCache(tf) {
  assertTimeframe(tf);
  return klineCaches[tf].get("data") ?? null;
}

module.exports = {
  VALID_TIMEFRAMES: VALID,
  setKlineCache,
  getKlineCache,
  getCompressedKlineCache, // <== newly added
};
