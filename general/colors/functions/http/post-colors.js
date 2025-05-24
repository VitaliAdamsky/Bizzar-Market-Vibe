const {
  getServantConfig,
} = require("@global/servants/servant-config/service.js");

// file: send-post.js
async function postColors(isDefaultColor = false, data) {
  const url = isDefaultColor
    ? getServantConfig().utilsApi + "/api/colors/set-default"
    : getServantConfig().utilsApi + "/api/colors/set";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { postColors };
