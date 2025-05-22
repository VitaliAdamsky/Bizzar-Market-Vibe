const ServantsConfigOperator = require("@global/servants/servants-config.js");
const {
  fetchFundingRateData,
} = require("@fr/functions/fetches/fetch-fr-data.js");

const { setFundingRateCache } = require("@fr/cache/service.js");

const { VALID_TIMEFRAMES } = require("@fr/config/timeframe.config.js");

const { delay } = require("@shared/utils/delay/delay.js");

async function initializeFundingRateStore() {
  const limit = ServantsConfigOperator.getConfig().limitFr || 52;
  console.log("limit", limit);

  // Loop through each timeframe and schedule job with delay
  for (const config of VALID_TIMEFRAMES) {
    const { timeframe, delay: delayMs } = config;

    console.log(`⏱ FR [${timeframe}] will init after ${delayMs / 60000} min`);

    setTimeout(async () => {
      try {
        const data = await fetchFundingRateData(limit);
        setFundingRateCache(timeframe, data);

        console.log(
          `💚 FR [${timeframe}] Cache initialized | Data size: ${data.data.length}`
        );
      } catch (err) {
        console.error(
          `❌ FR [${timeframe}] failed to initialize cache:`,
          err.message || err
        );
      }
    }, delayMs);
  }
}

module.exports = { initializeFundingRateStore };
