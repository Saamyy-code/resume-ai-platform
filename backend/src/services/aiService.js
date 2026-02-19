const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeResume(text, jobDescription = "") {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS resume analyzer. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
You are an ATS (Applicant Tracking System) resume analyzer.

Analyze the RESUME against the JOB DESCRIPTION.

Return ONLY valid JSON in this format:

{
  "match_score": number,
  "summary": "short professional summary",
  "strengths": ["point1","point2"],
  "missing_skills": ["skill1","skill2"],
  "improvement_suggestions": ["suggestion1","suggestion2"]
}

Rules:
- match_score must be between 0 and 100
- Compare resume skills with job description
- Identify missing skills required by the job
- Give actionable suggestions
- Return ONLY JSON (no explanations)

RESUME:
${text}

JOB DESCRIPTION:
${jobDescription || "No job description provided. Give general evaluation."}
`,
        },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0].message.content;

    console.log("AI RAW RESPONSE:", responseText);

    return JSON.parse(responseText);
  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      match_score: 0,
      summary: "AI analysis unavailable.",
      strengths: [],
      missing_skills: [],
      improvement_suggestions: [],
    };
  }
}

module.exports = { analyzeResume };
