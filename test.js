const {
  initializeFundingRateStore,
} = require("@fr/functions/initialize-fr-store.js");

const { getFundingRateCache } = require("@fr/cache/service.js");

const {
  getServantConfig,
  initializeServantsConfig,
} = require("@global/servants/servant-config/service.js");

async function main() {
  try {
    await initializeServantsConfig();
    await initializeFundingRateStore();
    const data = getFundingRateCache("1h");
    data.forEach((d) => {
      console.log(d.symbol, d.data[0]);
    });
    const config = getServantConfig();
    console.log("Config:", config);
  } catch (error) {
    console.error("Failed to initialize configuration:", error);
  }
}

main();
