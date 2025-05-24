// routes/coins.router.js
const express = require("express");
const {
  getColorsController,
  setColorsController,
  updateColorsCacheController,
} = require("@general/colors/controllers/colors.controller");

const router = express.Router();
router.get("/colors", getColorsController);
router.post("/colors", setColorsController);
router.post("/colors/update", updateColorsCacheController);
//router.post("/colors", setColorsController);

module.exports = router;
