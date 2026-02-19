const express = require("express");
const multer = require("multer");
const { extractTextFromPDF } = require("../services/resumeParser");
const pool = require("../db");
const { analyzeResume } = require("../services/aiService");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    // 1️⃣ Extract text from PDF
    const text = await extractTextFromPDF(req.file.path);

    // 2️⃣ Save raw resume to PostgreSQL
    const result = await pool.query(
      `INSERT INTO resumes (original_file_name, extracted_text)
       VALUES ($1, $2)
       RETURNING id`,
      [req.file.originalname, text]
    );

    let analysis;
    let savedResume = null; // ⭐ important fix

    try {
      analysis = await analyzeResume(text);

      // Save AI result to MongoDB
      const Resume = require("../models/Resume");

      savedResume = await Resume.create({
        filename: req.file.originalname,
        analysis: analysis,
      });

    } catch (err) {
      console.error("AI error:", err.message);

      // fallback analysis
      analysis = {
        summary: "AI analysis unavailable.",
        strengths: [],
        missing_skills: [],
        improvement_suggestions: [],
      };
    }

    // 3️⃣ Save analysis JSON to PostgreSQL
    await pool.query(
      `INSERT INTO resume_analysis (resume_id, analysis_json)
       VALUES ($1, $2)`,
      [result.rows[0].id, analysis]
    );

    // 4️⃣ Send response
    res.json({
      message: "Resume analyzed & saved successfully 🚀",
      analysis,
      id: savedResume ? savedResume._id : null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to process resume");
  }
});


router.get("/history", async (req, res) => {
  try {
    const Resume = require("../models/Resume");

    const resumes = await Resume.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(10);

    res.json(resumes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch resume history");
  }
});

module.exports = router;
