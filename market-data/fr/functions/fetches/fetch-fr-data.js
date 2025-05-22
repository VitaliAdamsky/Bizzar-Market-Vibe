// open-interest.service.js
const { fetchBinanceFr } = require("@fr/functions/fetches/fetch-binance-fr.js");

const { fetchBybitFr } = require("@fr/functions/fetches/fetch-bybit-fr.js");

const { getBinanceDominantCache } = require("@coins/cache/service.js");

const {
  normalizeFundingRateData,
} = require("@fr/functions/processing/normalize-fr-data.js");

const {
  fixFundingRateChange,
} = require("@fr/functions/processing/fix-fr-change.js");

async function fetchFundingRateData(limit) {
  const { binancePerps, bybitPerps } = getBinanceDominantCache();
  const binancePerpCoins = binancePerps;
  const bybitPerpCoins = bybitPerps;

  // 2. Concurrently fetch FR data from both exchanges
  const [binanceFrData, bybitFrData] = await Promise.all([
    fetchBinanceFr(binancePerpCoins, limit),
    fetchBybitFr(bybitPerpCoins, limit),
  ]);

  // 3. Calculate when this data should expire
  const lastOpenTime =
    bybitFrData[0]?.data?.at(-1)?.openTime ??
    bybitFrData[0]?.data?.at(-1)?.openTime;

  const lastCloseTime =
    bybitFrData[0]?.data?.at(-1)?.closeTime ??
    bybitFrData[0]?.data?.at(-1)?.closeTime;

  const expirationTime = lastCloseTime + (lastCloseTime - lastOpenTime) + 1;

  let data = fixFundingRateChange([...binanceFrData, ...bybitFrData]);

  data = normalizeFundingRateData(data);

  return { expirationTime, data };
}

module.exports = { fetchFundingRateData };
