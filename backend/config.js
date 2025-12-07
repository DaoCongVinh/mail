require('dotenv').config();

module.exports = {
  DOMAIN: process.env.DOMAIN || "congcumienphi.online",
  API_KEY: process.env.IMPROVMX_API_KEY || "",
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fake_mail",
  PORT: process.env.PORT || 3001
};
