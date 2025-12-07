const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// POST /api/webhook/email - Nhận email từ ImprovMX webhook
router.post("/email", async (req, res) => {
  try {
    const { to, from, subject, text, html, attachments } = req.body;

    // Extract inbox name from email address
    const inbox = to.split("@")[0];

    // Lưu email vào database
    const newEmail = await Email.create({
      inbox,
      from,
      to,
      subject: subject || "(No Subject)",
      text: text || "",
      html: html || "",
      attachments: attachments || []
    });

    console.log(`📧 New email received for ${inbox}:`, subject);

    res.status(200).json({
      success: true,
      message: "Email received",
      id: newEmail._id
    });
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
