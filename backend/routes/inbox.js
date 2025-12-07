const express = require("express");
const router = express.Router();
const Email = require("../models/Email");

// GET /api/inbox/:inbox - Lấy tất cả email của inbox
router.get("/:inbox", async (req, res) => {
  try {
    const { inbox } = req.params;

    // Tìm tất cả email theo inbox, sắp xếp mới nhất trước
    const emails = await Email.find({ inbox })
      .sort({ date: -1 })
      .select("-__v")
      .lean();

    res.json({
      success: true,
      inbox: inbox,
      count: emails.length,
      emails: emails
    });
  } catch (err) {
    console.error("Error fetching inbox:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET /api/inbox/:inbox/:emailId - Lấy chi tiết 1 email
router.get("/:inbox/:emailId", async (req, res) => {
  try {
    const { inbox, emailId } = req.params;

    const email = await Email.findOne({
      _id: emailId,
      inbox: inbox
    }).lean();

    if (!email) {
      return res.status(404).json({
        success: false,
        error: "Email not found"
      });
    }

    res.json({
      success: true,
      email: email
    });
  } catch (err) {
    console.error("Error fetching email:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// DELETE /api/inbox/:inbox - Xóa tất cả email của inbox
router.delete("/:inbox", async (req, res) => {
  try {
    const { inbox } = req.params;

    const result = await Email.deleteMany({ inbox });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} emails`
    });
  } catch (err) {
    console.error("Error deleting emails:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
