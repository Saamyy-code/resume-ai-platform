const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeResume(text) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume analyzer. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `
Analyze this resume and return JSON in this exact format:

{
  "match_score": number,
  "summary": "short summary",
  "strengths": ["point1","point2"],
  "missing_skills": ["skill1","skill2"],
  "improvement_suggestions": ["suggestion1","suggestion2"]
}

Rules:
- match_score must be between 0 and 100
- return ONLY JSON
- no explanations outside JSON

Resume:
${text}
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
      summary: "AI analysis unavailable.",
      strengths: [],
      missing_skills: [],
      improvement_suggestions: [],
    };
  }
}

module.exports = { analyzeResume };
