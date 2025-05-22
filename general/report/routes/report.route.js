const express = require("express");
const {
  getReportController,
} = require("@general/report/controllers/report.controller.js");

const router = express.Router();
router.get("/report", getReportController);

module.exports = router;
