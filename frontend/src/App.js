import { useState, useEffect, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumehistory, setResumeHistory] = useState([]);
  const analysisRef = useRef(null);

  const fetchHistory = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/resumes/history"
    );

    const data = await response.json();
    setResumeHistory(data);
  } catch (err) {
    console.error("Failed to fetch history:", err);
  }
};
    useEffect(() => {
      fetchHistory();
    }, []);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/resumes/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Card UI style
  const cardStyle = {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "15px",
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
        background: "#f9fafb",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Resume Analyzer 🚀</h1>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      {/* UPLOAD BUTTON */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{
          padding: "10px 18px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "⏳ Analyzing Resume..." : "Upload Resume"}
      </button>

      {file && <p>Selected: {file.name}</p>}

      {/* AI THINKING MESSAGE */}
      {loading && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          🤖 AI is analyzing your resume...
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div ref ={analysisRef} style={{ marginTop: "30px" }}>
          <h2>AI Analysis</h2>
          {/* MATCH SCORE */}
          {result?.analysis?.match_score !== undefined && (
            <div
              style={{
                background: "#ecfdf5",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                textAlign: "center",
                border: "2px solid #10b981",
              }}
            >
              <h2 style={{ margin: 0, color: "#065f46" }}>
                🎯 Match Score: {result.analysis.match_score}%
              </h2>
            </div>
          )}

          {/* SUMMARY */}
          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb" }}>🧠 Summary</h3>
            <p>
              {result?.analysis?.summary || "No summary available."}
            </p>
          </div>

          {/* STRENGTHS */}
          <div style={cardStyle}>
            <h3 style={{ color: "#16a34a" }}>✅ Strengths</h3>
            <ul>
              {result?.analysis?.strengths?.length > 0 ? (
                result.analysis.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <p>No strengths detected.</p>
              )}
            </ul>
          </div>

          {/* MISSING SKILLS */}
          <div style={cardStyle}>
            <h3 style={{ color: "#dc2626" }}>⚠️ Missing Skills</h3>
            <ul>
              {result?.analysis?.missing_skills?.length > 0 ? (
                result.analysis.missing_skills.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <p>No missing skills detected.</p>
              )}
            </ul>
          </div>

          {/* IMPROVEMENT SUGGESTIONS */}
          <div style={cardStyle}>
            <h3 style={{ color: "#f59e0b" }}>💡 Improvement Suggestions</h3>
            <ul>
              {result?.analysis?.improvement_suggestions?.length > 0 ? (
                result.analysis.improvement_suggestions.map(
                  (item, index) => <li key={index}>{item}</li>
                )
              ) : (
                <p>No suggestions available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
      {/* ================= HISTORY ================= */}
{resumehistory.length > 0 && (
  <div style={{ marginTop: "40px" }}>
    <h2>📜 Previous Analyses</h2>

    {resumehistory.map((item) => (
      <div key={item._id} style={cardStyle}>
        <h3>{item.filename}</h3>

        <p>
          <strong>Summary:</strong>{" "}
          {item.analysis?.summary || "No summary"}
        </p>

        <button
          onClick={() => {
            setResult(item);

            setTimeout(() => {
              analysisRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }, 100);
          }}
          style={{
            marginTop: "10x",
            padding: "6px 12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          View Analysis
        </button>
        <small style={{ color: "gray" }}>
          {new Date(item.createdAt).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default App;
