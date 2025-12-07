/**
 * Test script để mô phỏng ImprovMX gửi email đến webhook
 * Chạy script này để test webhook mà không cần expose backend ra internet
 */

const axios = require("axios");

const API_URL = "http://localhost:3001";

// Mô phỏng email từ ImprovMX
async function testWebhook(inbox) {
  const testEmail = {
    from: "test@example.com",
    to: `${inbox}@congcumienphi.online`,
    subject: "🎉 Test Email from ImprovMX",
    text: "This is a test email to verify webhook is working correctly!",
    html: "<h1>Test Email</h1><p>This is a test email to verify webhook is working correctly!</p>",
    attachments: []
  };

  console.log("📤 Sending test email to webhook...");
  console.log("To:", testEmail.to);
  console.log("Subject:", testEmail.subject);

  try {
    const response = await axios.post(
      `${API_URL}/api/webhook/email`,
      testEmail
    );

    console.log("\n✅ Webhook response:", response.data);
    console.log("\n🎯 Check your inbox in the frontend!");
  } catch (err) {
    console.error("\n❌ Error:", err.response?.data || err.message);
  }
}

// Main function
async function main() {
  console.log("🧪 Webhook Testing Tool\n");

  // Lấy inbox từ command line argument
  const inbox = process.argv[2];

  if (!inbox) {
    console.log("Usage: node test-webhook.js <inbox>");
    console.log("Example: node test-webhook.js abc123xyz");
    console.log("\n💡 Tip: Generate an email in frontend first, then use that inbox name here.");
    process.exit(1);
  }

  await testWebhook(inbox);
}

main();
