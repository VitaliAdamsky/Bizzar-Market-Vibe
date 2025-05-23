// jobs/selfPing.js

const { CronJob } = require("cron");
const { getUrlCacheData } = require("@general/report/cache/service.js");

async function fetchSelfPongData() {
  try {
    const url = getUrlCacheData();
    //TODO
    console.log("URL", url);
    if (url) {
      const response = await fetch(`${url}/report`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      console.log("🔆 Self Report sent:", data);
    } else {
      console.log(
        "⚠️ UrlCache is empty. No Self Report URL to send report to."
      );
    }
  } catch (error) {
    console.error("❌ Error sending Self Report:", error);
  }
}

function scheduleSelfPing() {
  // Cron expression: second minute hour day month day-of-week
  // '30 0/14 * * * *' → at second 30, every 14 minutes
  const job = new CronJob(
    "30 */4 * * * *", // note: '*/14' syntax for every 14 minutes
    fetchSelfPongData, // onTick
    null, // onComplete
    true, // start right away
    "UTC" // runs in UTC; adjust if needed
  );
  job.start();
  console.log("⏳ Schedule Self-ping: every 14 minutes at :30s (UTC)");
}

module.exports = { scheduleSelfPing };
