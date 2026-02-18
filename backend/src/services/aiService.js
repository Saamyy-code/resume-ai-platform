const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const prompt = `
You are a resume expert.
Analyze the following resume and return ONLY valid JSON with:

{
  "summary": "",
  "strengths": [],
  "missing_skills": [],
  "improvement_suggestions": []
}

Resume:
${text}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();

  // Gemini sometimes wraps JSON in markdown
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

module.exports = { analyzeResume };
