const { bybitFrUrl } = require("./bybit-fr-url.js");
const { getPLimit } = require("../shared/utility/p-limit.js");
const { delay } = require("../shared/delay/delay.js");

const CONCURRENCY_LIMIT = Number(process.env.CONCURRENCY_LIMIT) || 20;

async function fetchBybitFr(coins, limit) {
  const limitConcurrency = await getPLimit(CONCURRENCY_LIMIT);

  const fetchFundingRate = async (coin) => {
    try {
      const url = bybitFrUrl(coin.symbol, limit);
      await delay(Number(process.env.FETCH_DELAY) || 100);
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${coin.symbol}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (
        !responseData?.result?.list ||
        !Array.isArray(responseData.result.list)
      ) {
        console.error(`Invalid response for ${coin.symbol}:`, responseData);
        throw new Error(`Invalid response for ${coin.symbol}`);
      }

      const rawEntries = responseData.result.list
        .map((entry) => ({
          ...entry,
          fundingRateTimestamp: Number(entry.fundingRateTimestamp),
          fundingRate: Number(entry.fundingRate),
        }))
        .sort((a, b) => a.fundingRateTimestamp - b.fundingRateTimestamp);

      const baseInterval =
        rawEntries.length >= 2
          ? rawEntries[1].fundingRateTimestamp -
            rawEntries[0].fundingRateTimestamp
          : 8 * 3600 * 1000;

      const data = rawEntries.map((entry, index, arr) => {
        const currentRate = entry.fundingRate;
        const openTime = entry.fundingRateTimestamp;
        const closeTime = openTime + baseInterval - 1;

        let fundingRateChange = null;

        if (index > 0) {
          const prevRate = Number(arr[index - 1].fundingRate);

          if (prevRate !== 0) {
            fundingRateChange = Number(
              (((currentRate - prevRate) / Math.abs(prevRate)) * 100).toFixed(2)
            );
          } else {
            fundingRateChange = currentRate !== 0 ? 100 : null;
          }
        }

        return {
          openTime,
          closeTime,
          fundingRate: currentRate,
          fundingRateChange:
            fundingRateChange !== null
              ? Number(fundingRateChange.toFixed(2))
              : null,
        };
      });

      return {
        symbol: coin.symbol,
        exchanges: coin.exchanges || [],
        imageUrl: coin.imageUrl || "",
        category: coin.category || "",
        data: data.slice(1),
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { symbol: coin.symbol, data: [] };
    }
  };

  const promises = coins.map((coin) =>
    limitConcurrency(() => fetchFundingRate(coin))
  );

  return Promise.all(promises);
}

module.exports = { fetchBybitFr };
