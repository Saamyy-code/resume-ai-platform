import { useState, useEffect, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeHistory, setResumeHistory] = useState([]);
  const analysisRef = useRef(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdFile, setJdFile] = useState(null);

  /* ================= FETCH HISTORY ================= */
  const fetchHistory = async () => {
    try {
      const response = await fetch(
        process.env.React_APP_API_URL
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
  
  useEffect(() => {
    if(result && analysisRef.current) {
      analysisRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    if(jdFile){
      formData.append("jdFile, jdFile");
    }

    try {
      setLoading(true);

      const response = await fetch(
        process.env.React_APP_API_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);

      // refresh history after upload
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI STYLE ================= */
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

      <h3>Upload Resume</h3>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <p style={{ color : "gray"}}>
          Selected Resume : {file.name}
        </p>
      )}

      {/* JOB DESCRIPTION */}
      <div style = {{ marginTop: "20px"}}>
        <h3> Job Description</h3>

        <textarea
        placeholder="Paste Job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          height: "120px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
        />
        <p style={{ fontWeight: "hold" }}>
           OR upload Job Description
        </p>
        
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setJdFile(e.target.files[0])}
        />

        {jdFile && (
          <p style={{ fontSize: "14px" }}>
            📎 JD File Selected: {jdFile.name}
          </p>
        )}
      </div>
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

      {/* LOADING MESSAGE */}
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

      {/* ================= CURRENT RESULT ================= */}
      {result && (
        <div ref={analysisRef} style={{ marginTop: "30px" }}>
          <h2>AI Analysis</h2>
          
          {/* MATCH SCORE */}
          {result?.analysis?.match_score !== undefined && (
            <div
              style={{
                background: "#eef2ff",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "15px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              🎯 Match Score: {result.analysis.match_score}%
            </div>
          )}
          {/* SUMMARY */}
          <div style={cardStyle}>
            <h3 style={{ color: "#2563eb" }}>🧠 Summary</h3>
            <p>{result?.analysis?.summary || "No summary available."}</p>
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

          {/* MISSING SKILLS (OBJECT FIX ✅) */}
          <div style={cardStyle}>
            <h3 style={{ color: "#dc2626" }}>⚠️ Missing Skills</h3>
            <ul>
              {result?.analysis?.missing_skills?.length > 0 ? (
                result.analysis.missing_skills.map((item, index) => (
                  <li key={index}>
                    <strong>{item.skill}</strong>
                    <br />
                    <span style={{ color: "gray", fontSize: "14px" }}>
                      {item.reason}
                    </span>
                  </li>
                ))
              ) : (
                <p>No missing skills detected.</p>
              )}
            </ul>
          </div>

          {/* IMPROVEMENTS */}
          <div style={cardStyle}>
            <h3 style={{ color: "#f59e0b" }}>
              💡 Improvement Suggestions
            </h3>
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
      {resumeHistory.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>📜 Previous Analyses</h2>

          {resumeHistory.map((item) => (
            <div key={item._id} style={cardStyle}>
              <h3>{item.filename}</h3>

              <p>
                <strong>Summary:</strong>{" "}
                {item.analysis?.summary || "No summary"}
              </p>

              <small style={{ color: "gray" }}>
                {new Date(item.createdAt).toLocaleString()}
              </small>

              <br />
              <br />

              <button
                onClick={() =>
                  setResult({ analysis: item.analysis })
                }
                style={{
                  padding: "6px 12px",
                  background: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                View Analysis
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;