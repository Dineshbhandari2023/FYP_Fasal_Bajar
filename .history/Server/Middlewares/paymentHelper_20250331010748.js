const crypto = require("crypto");

function generateHmacSha256Hash(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64");
}

module.exports = { generateHmacSha256Hash };
