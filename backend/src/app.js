const express = require("express");
const pool = require("./db");
const mongoose = require("mongoose");
const resumeRoutes = require("./routes/resumeRoutes");
require("dotenv").config();   // ✅ make sure this exists

// ===============================
// MongoDB Connection 
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://resume-ai-platform-ten.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Mount routes
app.use("/api/resumes", resumeRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Backend + DB connected 🚀",
      time: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
