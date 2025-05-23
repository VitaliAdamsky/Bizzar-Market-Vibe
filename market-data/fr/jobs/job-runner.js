const { CronJob } = require("cron");

const {
  getServantConfig,
} = require("@global/servants/servant-config/service.js");

const { TIMEFRAME_CONFIG } = require("@fr/config/timeframe.config.js");

const {
  fetchFundingRateData,
} = require("@fr/functions/fetches/fetch-fr-data.js");

const { setFundingRateCache } = require("@fr/cache/service.js");

const { UnixToNamedTimeRu } = require("@shared/utils/time-converter.js");

async function runFundingRateFetch(timeframe) {
  const limit = getServantConfig().limitKline;
  try {
    const data = await fetchFundingRateData(limit);
    setFundingRateCache(timeframe, data);
    console.log(
      `🤍 [${UnixToNamedTimeRu(
        Date.now()
      )}] FR Cache ${timeframe} --> updated...`
    );
  } catch (error) {
    console.error(
      `❌ [${UnixToNamedTimeRu(
        Date.now()
      )}] Failed to update Kline cache for ${timeframe}`,
      error instanceof Error ? error.message : error
    );
  }
}

function scheduleFundingRateJobs() {
  Object.keys(TIMEFRAME_CONFIG).forEach((tf) => {
    const { cron, delay } = TIMEFRAME_CONFIG[tf];

    // Create a new CronJob
    const job = new CronJob(
      cron,
      () => {
        console.log(
          `👉 [FR JOB] Scheduled ${tf} job (cron: ${cron}, delay: ${delay} min)`
        );

        setTimeout(() => {
          console.log(`🛠 [KLINE JOB] Running ${tf} job after ${delay} min`);
          runFundingRateFetch(tf);
        }, 3 * 1000); // Convert minutes to milliseconds
      },
      null, // onComplete callback
      true, // Start the job right now
      "UTC" // Time zone
    );

    console.log(`👉 [KLINE JOB] for ${tf} is set up with cron: ${cron}`);

    job.start(); // Start the job
  });
}

module.exports = {
  scheduleFundingRateJobs,
};
