const {
  getServantConfig,
} = require("@global/servants/servant-config/service.js");

async function fetchColors(defaultColors = false) {
  const url = defaultColors
    ? getServantConfig().utilsApi + "/api/colors/get-default"
    : getServantConfig().utilsApi + "/api/colors/get";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const result = await response.json();
    if (result.error) {
      throw new Error({
        origin: getServantConfig().projectName,
        message: "Failed to fetch colors from vercel",
        error: result.error,
      });
    }
    return result;
  } catch (error) {
    console.error("❌ [fetchColors] Error:", error);
  }
}

module.exports = { fetchColors };
