const express = require("express");
const multer = require("multer");
const { extractTextFromPDF } = require("../services/resumeParser");
const pool = require("../db");
const { analyzeResume } = require("../services/aiService");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload + extract text
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const text = await extractTextFromPDF(req.file.path);

    const result = await pool.query(
      `INSERT INTO resumes (original_file_name, extracted_text)
      VALUES ($1, $2)
      RETURNING id`,
      [req.file.originalname, text]
    );

    // Analyze resume with AI
    let analysis;
    try {
      analysis = await analyzeResume(text);
    } catch (err) {
      console.error("AI error:", err.message);
      // Save AI analysis to DB
       analysis = {
        summary: "AI analysis unavailable (quota exceeded).",
        strengths: [],
        missing_skills: [],
        improvement_suggestions: [],
      };
    }

      await pool.query(
        `INSERT INTO resume_analysis (resume_id, analysis_json)
        VALUES ($1, $2)`,
        [result.rows[0].id, analysis]
      );

    res.json({
      message: "Resume uploaded, analyzed, and saved 🚀",
      resumeId: result.rows[0].id, analysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to extract text");
  }
});

module.exports = router;
