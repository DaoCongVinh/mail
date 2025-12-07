const express = require("express");
const router = express.Router();
const axios = require("axios");
const { DOMAIN, API_KEY } = require("../config");

// Generate random inbox name
function randomInbox() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/alias/new - Tạo email mới
router.get("/new", async (req, res) => {
  const inbox = randomInbox();
  const email = `${inbox}@${DOMAIN}`;

  // Không cần tạo alias vì ImprovMX đã có catch-all hoặc webhook
  // Chỉ cần return email random, webhook sẽ tự động nhận email
  res.json({
    success: true,
    email: email,
    inbox: inbox,
    message: "Email ready. Send emails to this address."
  });
});

// DELETE /api/alias/:inbox - Xóa alias (optional)
router.delete("/:inbox", async (req, res) => {
  const { inbox } = req.params;

  try {
    await axios.delete(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases/${inbox}`,
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    res.json({ success: true, message: "Alias deleted" });
  } catch (err) {
    console.error("Error deleting alias:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

module.exports = router;
