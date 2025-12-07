/**
 * Script tự động setup catch-all forwarding trong ImprovMX
 * Chạy: node setup-catchall.js YOUR_EMAIL@gmail.com
 */

const axios = require("axios");
const { DOMAIN, API_KEY } = require("./config");

async function setupCatchAll() {
  console.log("🔧 Setting up ImprovMX catch-all forwarding...\n");

  // Lấy forward email từ argument
  const forwardEmail = process.argv[2];
  
  if (!forwardEmail) {
    console.error("❌ Error: Please provide forward email address");
    console.error("Usage: node setup-catchall.js your-email@gmail.com");
    process.exit(1);
  }

  try {
    // 1. Kiểm tra alias hiện tại
    console.log("1️⃣ Checking existing aliases...");
    const checkResponse = await axios.get(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    console.log(`✅ Found ${checkResponse.data.aliases?.length || 0} existing aliases`);

    // Kiểm tra catch-all đã tồn tại chưa
    const catchAllExists = checkResponse.data.aliases?.find(
      a => a.alias === "*"
    );

    if (catchAllExists) {
      console.log("\n⚠️  Catch-all alias already exists!");
      console.log("Alias: *@" + DOMAIN);
      console.log("Forward to:", catchAllExists.forward);
      console.log("\nDo you want to update it? (Ctrl+C to cancel)");
      
      // Xóa catch-all cũ
      await axios.delete(
        `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/*`,
        {
          auth: {
            username: "api",
            password: API_KEY
          }
        }
      );
      console.log("✅ Old catch-all deleted");
    }

    // 2. Tạo catch-all mới
    console.log("\n2️⃣ Creating catch-all alias...");
    const createResponse = await axios.post(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        alias: "*",
        forward: forwardEmail
      },
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    console.log("\n🎉 Catch-all forwarding created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✉️  Any email to: *@" + DOMAIN);
    console.log("📬 Will forward to:", forwardEmail);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n💡 Now you can:");
    console.log("   1. Generate random emails in frontend");
    console.log("   2. Send test email to: test123@" + DOMAIN);
    console.log("   3. Check your inbox:", forwardEmail);

  } catch (err) {
    console.error("\n❌ Error setting up catch-all:");
    console.error(err.response?.data || err.message);
    
    if (err.response?.status === 422) {
      console.error("\n💡 Tip: Make sure the forward email is valid");
    }
  }
}

// Chạy script
setupCatchAll();
