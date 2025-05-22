const {
  initializeCoinsCache,
} = require("@coins/functions/initialize-coins-store.js");

async function refreshCoinsCacheController(_req, res, next) {
  try {
    await initializeCoinsCache();
    return res.status(200).json({ message: "Coins cache refreshed" });
  } catch (err) {
    console.error("Error fetching Coins:", err);
    return next(err);
  }
}

module.exports = {
  refreshCoinsCacheController,
};
