const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    filename: String,
    analysis: Object,
  },
  { timestamps: true } // ⭐ IMPORTANT
);

module.exports = mongoose.model("Resume", ResumeSchema);
