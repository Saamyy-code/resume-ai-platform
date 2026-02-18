CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  original_file_name TEXT,
  extracted_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
    