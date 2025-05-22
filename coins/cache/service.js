const {
  binanceDominantCache,
  bybitDominantCache,
} = require("@coins/cache/store.js");

const {
  fetchDominantCoinsFromDb,
} = require("@coins/functions/fetch-dominant-coins-from-db");

const {
  compressToGzipBase64,
  decompressFromGzipBase64,
} = require("@shared/utils/compression-utils.js");

/**
 * 🔄 initializeCoinsCache
 * -----------------------
 */
async function initializeCoinsCache() {
  const [binanceDominantPerps, binanceDominantSpot] = await Promise.all([
    fetchDominantCoinsFromDb("Binance", "perp"),
    fetchDominantCoinsFromDb("Binance", "spot"),
    fetchDominantCoinsFromDb("Bybit", "perp"),
  ]);

  // 💾 BINANCE dominant view cache (Binance-dominant logic)
  binanceDominantCache.binancePerp.set(
    "coins",
    compressToGzipBase64(binanceDominantPerps.binanceCoins)
  );
  binanceDominantCache.binanceSpot.set(
    "coins",
    compressToGzipBase64(binanceDominantSpot.binanceCoins)
  );
  binanceDominantCache.bybitPerp.set(
    "coins",
    compressToGzipBase64(binanceDominantPerps.bybitCoins)
  );
  binanceDominantCache.bybitSpot.set(
    "coins",
    compressToGzipBase64(binanceDominantSpot.bybitCoins)
  );

  // 💾 BYBIT dominant view cache (Bybit-dominant logic)
  bybitDominantCache.binancePerp.set(
    "coins",
    compressToGzipBase64(binanceDominantPerps.binanceCoins)
  );
  bybitDominantCache.bybitPerp.set(
    "coins",
    compressToGzipBase64(binanceDominantSpot.bybitCoins)
  );
}

/**
 * 🧠 getBinanceDominantCache
 * --------------------------
 */
function getBinanceDominantCache() {
  return {
    binancePerps: decompressFromGzipBase64(
      binanceDominantCache.binancePerp.get("coins")
    ),
    binanceSpot: decompressFromGzipBase64(
      binanceDominantCache.binanceSpot.get("coins")
    ),
    bybitPerps: decompressFromGzipBase64(
      binanceDominantCache.bybitPerp.get("coins")
    ),
    bybitSpot: decompressFromGzipBase64(
      binanceDominantCache.bybitSpot.get("coins")
    ),
  };
}

/**
 * 🧠 getBybitDominantCache
 * ------------------------
 * Retrieves and decompresses the Bybit-dominant view of coins from memory.
 */
function getBybitDominantCache() {
  return {
    binancePerps: decompressFromGzipBase64(
      bybitDominantCache.binancePerp.get("coins")
    ),
    bybitPerps: decompressFromGzipBase64(
      bybitDominantCache.bybitPerp.get("coins")
    ),
  };
}

module.exports = {
  initializeCoinsCache,
  getBinanceDominantCache,
  getBybitDominantCache,
};
