const { binanceFrUrl } = require("./binance-fr-url.js");
const { getPLimit } = require("../shared/utility/p-limit.js");
const { delay } = require("../shared/delay/delay.js");

const CONCURRENCY_LIMIT = Number(process.env.CONCURRENCY_LIMIT) || 20;

async function fetchBinanceFr(coins, limit) {
  const limitConcurrency = await getPLimit(CONCURRENCY_LIMIT);

  const fetchFrData = async (coin) => {
    try {
      const headers = new Headers();
      headers.set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      );
      headers.set("Accept", "*/*");
      headers.set("Accept-Language", "en-US,en;q=0.9");
      headers.set("Origin", "https://www.binance.com");
      headers.set("Referer", "https://www.binance.com/");

      const url = binanceFrUrl(coin.symbol, limit);
      await delay(Number(process.env.FETCH_DELAY) || 100);
      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${coin.symbol}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
        console.error(`Invalid response for ${coin.symbol}:`, responseData);
        throw new Error(`Invalid response for ${coin.symbol}`);
      }

      const rawEntries = responseData
        .map((entry) => ({
          fundingTime: Number(entry.fundingTime),
          fundingRate: Number(entry.fundingRate),
        }))
        .sort((a, b) => a.fundingTime - b.fundingTime);

      const baseInterval =
        rawEntries.length >= 2
          ? rawEntries[1].fundingTime - rawEntries[0].fundingTime
          : 8 * 3600 * 1000;

      const data = rawEntries.map((entry, index, arr) => {
        const currentOpenTime = entry.fundingTime;
        const currentRate = Number(entry.fundingRate);
        const closeTime = currentOpenTime + baseInterval - 1;

        let fundingRateChange = null;

        if (index > 0) {
          const prevRate = arr[index - 1].fundingRate;

          if (prevRate !== 0) {
            fundingRateChange = Number(
              (((currentRate - prevRate) / Math.abs(prevRate)) * 100).toFixed(2)
            );
          } else {
            if (currentRate > 0) fundingRateChange = 100;
            if (currentRate < 0) fundingRateChange = -100;
            if (currentRate === 0) fundingRateChange = 0;
          }
        }

        return {
          openTime: currentOpenTime,
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
        exchanges: coin.exchanges,
        imageUrl: coin.imageUrl,
        category: coin.category,
        data: data.slice(1),
      };
    } catch (error) {
      console.error(`Error processing ${coin.symbol}:`, error);
      return { symbol: coin.symbol, data: [] };
    }
  };

  const promises = coins.map((coin) =>
    limitConcurrency(() => fetchFrData(coin))
  );

  return Promise.all(promises);
}

module.exports = { fetchBinanceFr };
