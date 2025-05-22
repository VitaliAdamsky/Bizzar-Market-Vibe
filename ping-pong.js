const http = require("http");

// Binance Kline API endpoint
const BINANCE_KLINE_URL =
  "https://bizzar-market-vibe.onrender.com/api/kline?timefame=12h";

// Function to fetch Kline data
async function fetchKlines() {
  try {
    const response = await fetch(BINANCE_KLINE_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    console.log(`[${new Date().toISOString()}] ✅ Fetched data`);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] ❌ Fetch failed:`,
      error.message
    );
  }
}

// Schedule next fetch at a random delay between 4-5 minutes
function scheduleNextFetch() {
  const min = 4 * 60 * 1000; // 4 min
  const max = 5 * 60 * 1000; // 5 min
  const delay = Math.floor(Math.random() * (max - min) + min);

  console.log(`⏳ Next fetch in ${(delay / 60000).toFixed(2)} minutes`);
  setTimeout(async () => {
    await fetchKlines();
    scheduleNextFetch(); // Schedule the next one
  }, delay);
}

// Start the first fetch
scheduleNextFetch();

// Optional HTTP server to keep app alive
http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("Kline fetcher is running...\n");
  })
  .listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
