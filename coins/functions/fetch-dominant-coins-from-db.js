const ServantsConfigOperator = require("@global/servants/servants-config");

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

module.exports = { fetchDominantCoinsFromDb };
