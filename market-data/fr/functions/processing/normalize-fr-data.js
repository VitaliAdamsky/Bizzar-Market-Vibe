const { getColorsCache } = require("@general/colors/cache/service.js");

const {
  getGradientColorForNegativeRange,
} = require("@general/colors/functions/normalization/get-gradient-color-for-negative-range.js");

const {
  getColorFromChangeValue,
} = require("@general/colors/functions/normalization/get-color-from-change-value.js");

const { getPercentile } = require("@shared/normalization/get-percentile.js");

const PERCNETILE = 99;

function normalizeFundingRateData(marketDataArray) {
  const colors = getColorsCache();

  return marketDataArray.map((coinData) => {
    const data = coinData.data;

    // Extract funding rates and changes
    const fundingRates = data.map((item) => item.fundingRate ?? 0);
    const fundingRateChanges = data.map((item) => item.fundingRateChange ?? 0);

    // Robust scale for funding rate using 99th percentile of absolute values
    const absFundingRates = fundingRates.map(Math.abs);
    const clipValueFr = getPercentile(absFundingRates, PERCNETILE); // Adjust as needed
    const scaleFr = clipValueFr === 0 ? 1 : clipValueFr;

    // Robust scale for funding rate change
    const absFundingRateChanges = fundingRateChanges.map(Math.abs);
    const clipValueFrChange = getPercentile(absFundingRateChanges, PERCNETILE);
    const scaleFrChange = clipValueFrChange === 0 ? 1 : clipValueFrChange;

    // Map each item
    const updatedData = data.map((item) => {
      const fundingRate = item.fundingRate ?? 0;
      const fundingRateChange = item.fundingRateChange ?? 0;

      // Normalize funding rate using tanh with robust scaling
      const scaledFr = fundingRate / scaleFr;
      const tanhFr = Math.tanh(scaledFr);
      const normalizedFr = (tanhFr + 1) / 2; // Map to [0, 1]

      // Normalize funding rate change using tanh with robust scaling
      const scaledFrChange = fundingRateChange / scaleFrChange;
      const tanhFrChange = Math.tanh(scaledFrChange); // Map to [-1, 1]

      const frColor = getGradientColorForNegativeRange(
        fundingRate,
        colors.fundingRateMin,
        colors.fundingRateMax
      );

      const frChangeColor = getColorFromChangeValue(
        tanhFrChange,
        -1,
        1,
        colors.fundingRateChangeMin,
        colors.fundingRateChangeMax
      );

      return {
        ...item,
        normalizedFundingRate: Number(normalizedFr.toFixed(2)),
        normalizedFundingRateChange: Number(tanhFrChange.toFixed(2)),
        colors: {
          ...(item.colors || {}),
          fundingRate: frColor,
          fundingRateChange: frChangeColor,
        },
      };
    });

    return {
      ...coinData,
      data: updatedData,
    };
  });
}

module.exports = { normalizeFundingRateData };
