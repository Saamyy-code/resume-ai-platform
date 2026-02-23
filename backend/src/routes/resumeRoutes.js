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

router.post(
  "/upload",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jdFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // files from multer
      const resumeFile = req.files?.resume?.[0];
      const jdFile = req.files?.jdFile?.[0];

      if (!resumeFile) {
        return res.status(400).json({ error: "Resume required" });
      }

      const jobDescription = req.body.jobDescription || "";

      // Extract text from PDF
      const text = await extractTextFromPDF(resumeFile.path);

      // Save resume metadata (PostgreSQL)
      const result = await pool.query(
        `INSERT INTO resumes (original_file_name, extracted_text)
         VALUES ($1, $2)
         RETURNING id`,
        [resumeFile.originalname, text]
      );

      let analysis;
      let savedResume = null;

      try {
        analysis = await analyzeResume(text, jobDescription);

        //  Save AI result to MongoDB
        const Resume = require("../models/Resume");

        savedResume = await Resume.create({
          filename: resumeFile.originalname,
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

      // Save analysis JSON to PostgreSQL
      await pool.query(
        `INSERT INTO resume_analysis (resume_id, analysis_json)
         VALUES ($1, $2)`,
        [result.rows[0].id, analysis]
      );

      // Response
      res.json({
        message: "Resume analyzed & saved successfully 🚀",
        analysis,
        id: savedResume ? savedResume._id : null,
      });

    } catch (error) {
      console.error(error);
      res.status(500).send("Failed to process resume");
    }
  }
);

module.exports = router;