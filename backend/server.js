const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MONGO_URI, PORT } = require("./config");

// Import routes
const aliasRoute = require("./routes/alias");
const webhookRoute = require("./routes/webhook");
const inboxRoute = require("./routes/inbox");

// Initialize Express app
const app = express();

// CORS configuration - allow Vercel frontend and local development
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://mail-ao.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Temporary Email API Server",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/alias", aliasRoute);
app.use("/api/webhook", webhookRoute);
app.use("/api/inbox", inboxRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`📧 Webhook endpoint: http://localhost:${PORT}/api/webhook/email`);
      console.log(`📬 Ready to receive emails!`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
