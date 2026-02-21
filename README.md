# Resume AI Analyzer 

Resume AI Analyzer is a full-stack web application that analyzes resumes using AI and provides structured feedback based on a given job description.  
It helps users understand how well their resume matches a role by generating insights such as match score, strengths, missing skills, and improvement suggestions.

This project was built as a practical learning project to explore AI integration, full-stack development, database design, and cloud deployment.

---

## Features

-  Upload resumes in PDF format
-  AI-powered resume analysis
-  Job description matching
-  Match score calculation
-  Strength identification
-  Missing skills detection
-  Improvement suggestions
-  Resume analysis history
-  Cloud deployment support

---

## Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- CSS

### Backend
- Node.js
- Express.js
- REST API architecture

### Databases
- MongoDB Atlas — stores AI analysis results
- PostgreSQL — stores structured resume metadata

### AI Integration
- Groq API (LLM-based resume analysis)

### Deployment
- Frontend: Vercel
- Backend: Render

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-ai-platform.git
cd resume-ai-platform
```
### 2. Install dependencies
Backend
  ```bash
  cd backend
  npm install
  ```
Frontend
  ```bash
  cd frontend
  npm install
  ```
### 3. Enviroment Variables
Create a .env file inside the backend folder:
```bash
PORT = 5000
MONGO_URI=your_mongodb_connection_string
DATABASE_URL=your_postgres_connection_string
AI_API_KEY=your_ai_api_key
```
Create .env file inside the frontend folder:
```bash
REACT_APP_API_URL=http://localhost:5000
```
### 4. Run the application
Start backend
```bash
npm run dev
```
Start frontend
```bash
npm start
```
Open:
```bash
http://localhost:3000
```
## Deployment

Backend(Render)
- Connect Github repository
- Add enviroment variables
- Deploy Node service
- Attach PostgreSQL database

Frontend(Vercel)
- Import Github repo
- Set enviroment variable
- Deploy

---

## Learning Outcomes
This project helped me understand:
- Full-stack application architecture
- API integration with AI services
- File uploads and processing pipelines
- Database schema debugging & migrations
- Cloud deployment challenges (Render/ Vercel)
- Handling real production errors and logs

---

## Future Improvements
- User authentication
- Resume version comparison
- Downloadable AI-enhanced resume
- Better scoring visualization
- Resume keyword optimaization



  
