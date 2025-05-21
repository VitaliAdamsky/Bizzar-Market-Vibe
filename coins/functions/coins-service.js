// coins-service.js
const { binanceDominantCache } = require("./coins-cache");
const ServantsConfigOperator = require("../../functions/global/servants/servants-config");
const {
  compressToBase64,
  decompressFromBase64,
} = require("../../functions/shared/utility/compression-utils"); // Adjust path

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
    compressToBase64(binanceDominantPerps.binanceCoins)
  );
  binanceDominantCache.binanceSpot.set(
    "coins",
    compressToBase64(binanceDominantSpot.binanceCoins)
  );
  binanceDominantCache.bybitPerp.set(
    "coins",
    compressToBase64(binanceDominantPerps.bybitCoins)
  );
  binanceDominantCache.bybitSpot.set(
    "coins",
    compressToBase64(binanceDominantSpot.bybitCoins)
  );
}

// Get and decompress
function getBinanceDominantCache() {
  return {
    binancePerps: decompressFromBase64(
      binanceDominantCache.binancePerp.get("coins")
    ),
    binanceSpot: decompressFromBase64(
      binanceDominantCache.binanceSpot.get("coins")
    ),
    bybitPerps: decompressFromBase64(
      binanceDominantCache.bybitPerp.get("coins")
    ),
    bybitSpot: decompressFromBase64(
      binanceDominantCache.bybitSpot.get("coins")
    ),
  };
}

module.exports = {
  initializeCoinsCache,
  getBinanceDominantCache,
};
