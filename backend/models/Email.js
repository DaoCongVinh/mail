const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  inbox: {
    type: String,
    required: true,
    index: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: "(No Subject)"
  },
  text: {
    type: String,
    default: ""
  },
  html: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: Array,
    default: []
  }
});

// Index để query nhanh theo inbox
EmailSchema.index({ inbox: 1, date: -1 });

// Tự động xóa email sau 1 giờ (TTL index)
EmailSchema.index({ date: 1 }, { expireAfterSeconds: 3600 });

module.exports = mongoose.model("Email", EmailSchema);
