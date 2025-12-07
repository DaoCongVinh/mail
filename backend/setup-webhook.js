/**
 * Script tự động setup webhook trong ImprovMX
 * Chạy: node setup-webhook.js
 */

const axios = require("axios");
const { DOMAIN, API_KEY } = require("./config");

const WEBHOOK_URL = "https://mail-ao-backend.onrender.com/api/webhook/email";

async function setupWebhook() {
  console.log("🔧 Setting up ImprovMX webhook...\n");

  try {
    // 1. Kiểm tra webhook hiện tại
    console.log("1️⃣ Checking existing webhooks...");
    const checkResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/webhooks`,
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    console.log("✅ Current webhooks:", checkResponse.data);

    // Kiểm tra xem webhook đã tồn tại chưa
    const existingWebhook = checkResponse.data.webhooks?.find(
      w => w.url === WEBHOOK_URL
    );

    if (existingWebhook) {
      console.log("\n✅ Webhook already exists!");
      console.log("Webhook URL:", existingWebhook.url);
      console.log("Status:", existingWebhook.active ? "Active" : "Inactive");
      return;
    }

    // 2. Tạo webhook mới
    console.log("\n2️⃣ Creating new webhook...");
    const createResponse = await axios.post(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/webhooks`,
      {
        url: WEBHOOK_URL,
        events: ["email.received", "email.forwarded"]
      },
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    console.log("\n🎉 Webhook created successfully!");
    console.log("Webhook details:", createResponse.data);

  } catch (err) {
    if (err.response?.status === 403) {
      console.error("\n❌ Error: Webhook is a PRO feature!");
      console.error("You need to upgrade ImprovMX to PRO plan to use webhooks.");
      console.error("Visit: https://improvmx.com/pricing");
      console.error("\n💡 Alternative: Use catch-all forwarding instead.");
      return;
    }

    console.error("\n❌ Error setting up webhook:");
    console.error(err.response?.data || err.message);
  }
}

// Chạy script
setupWebhook();
