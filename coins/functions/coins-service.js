// coins-service.js
const { binanceDominantCache } = require("./coins-cache");
const ServantsConfigOperator = require("../../functions/global/servants/servants-config");
const {
  compressToGzipBase64,
  decompressFromGzipBase64,
  com,
} = require("@shared/utility/compression-utils.js"); // Adjust path

// Fetch coins from DB
async function fetchDominantCoinsFromDb(dominant, coinType) {
  const config = ServantsConfigOperator.getConfig();
  if (!config?.coinsApi) {
    throw new Error("Missing COINS API configuration");
  }

  const url = `${config.coinsApi}/api/coins/sorted?dominant=${dominant}&coinType=${coinType}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${errorText}`);
  }

  return await response.json();
}

async function initializeCoinsCache() {
  const [binanceDominantPerps, binanceDominantSpot] = await Promise.all([
    fetchDominantCoinsFromDb("Binance", "perp"),
    fetchDominantCoinsFromDb("Binance", "spot"),
  ]);

  // Store compressed
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
}

// Get and decompress
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

module.exports = {
  initializeCoinsCache,
  getBinanceDominantCache,
};
