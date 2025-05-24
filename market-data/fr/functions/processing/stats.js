function stats(yourData) {
  const fundingRates = {
    positive: [],
    negative: [],
  };

  const fundingRateChanges = {
    positive: [],
    negative: [],
  };

  const dataset = yourData.data;

  // replace with actual object if not named `yourData`
  if (!Array.isArray(dataset)) {
    console.error("❌ Funding rate data is not an array:", dataset);
    return;
  }

  dataset.forEach((coin) => {
    coin.data.forEach((entry) => {
      if (entry.fundingRate > 0) {
        fundingRates.positive.push(entry.fundingRate);
      } else if (entry.fundingRate < 0) {
        fundingRates.negative.push(entry.fundingRate);
      }

      if (entry.fundingRateChange > 0) {
        fundingRateChanges.positive.push(entry.fundingRateChange);
      } else if (entry.fundingRateChange < 0) {
        fundingRateChanges.negative.push(entry.fundingRateChange);
      }
    });
  });

  console.log("Positive fundingRates:", fundingRates.positive.length);
  console.log("Negative fundingRates:", fundingRates.negative.length);
  console.log(
    "Positive fundingRateChanges:",
    fundingRateChanges.positive.length
  );
  console.log(
    "Negative fundingRateChanges:",
    fundingRateChanges.negative.length
  );
}

module.exports = { stats };
