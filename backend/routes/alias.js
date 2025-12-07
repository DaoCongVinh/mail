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

  try {
    // Tạo alias trong ImprovMX - không cần forward vì dùng webhook
    const response = await axios.post(
      `https://api.improvmx.com/v3/domains/${DOMAIN}/aliases`,
      {
        alias: inbox,
        forward: `${inbox}@${DOMAIN}` // Forward về chính nó để trigger webhook
      },
      {
        auth: {
          username: "api",
          password: API_KEY
        }
      }
    );

    res.json({
      success: true,
      email: email,
      inbox: inbox,
      data: response.data
    });
  } catch (err) {
    console.error("Error creating alias:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
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
