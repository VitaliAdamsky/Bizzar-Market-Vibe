// routes/coins.router.js
const express = require("express");
const {
  getColorsController,
  setColorsController,
} = require("@general/colors/controllers/colors.controller");

const router = express.Router();
router.get("/colors", getColorsController);
router.post("/colors", setColorsController);

module.exports = router;
