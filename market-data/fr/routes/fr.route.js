// routes/coins.router.js
const express = require("express"); // Import Express :contentReference[oaicite:2]{index=2}
const {
  getFundingRateDataController,
  refreshFundingRateStoreController,
} = require("@fr/controllers/fr.controller.js");

const router = express.Router();
router.get("/fr", getFundingRateDataController);
router.get("/fr/refresh", refreshFundingRateStoreController);

module.exports = router;
