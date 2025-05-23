const express = require("express");

const {
  getReportController,
} = require("@general/report/controllers/report.controller.js");

const {
  getFullUrlController,
} = require("@general/report/controllers/report.controller.js");

const router = express.Router();
router.get("/report", getReportController);
router.get("/report/url", getFullUrlController);

module.exports = router;
