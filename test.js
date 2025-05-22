const fs = require("fs");
const zlib = require("zlib");

const compressed = fs.readFileSync("kline(3)");
const json = zlib.gunzipSync(compressed).toString();
const data = JSON.parse(json);

console.log("✅ Parsed:", data);
