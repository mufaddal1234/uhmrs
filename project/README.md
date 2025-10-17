# Audit-GPT: Financial Document Analysis System

This project integrates a React frontend with a RAG model backend for analyzing financial audit documents. Users can upload documents (PDF, DOCX, TXT) and receive AI-powered analysis and insights.

## Project Structure

```
project/
├── backend/               # Flask backend API
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── .env.example       # Environment variables template
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── pages/             # Page components
│   └── ...                # Other frontend files
└── Audit-GPT/             # RAG model implementation
    └── RAG model/         # Core RAG model code
```

## Setup Instructions

### Backend Setup

1. Create and activate a Python virtual environment:

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Edit the `.env` file and add your GROQ API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

5. Start the backend server:

```bash
python app.py
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Install Node.js dependencies:

```bash
# Navigate to the project root directory
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Click on "Upload" in the navigation menu
3. Drag and drop a financial document (PDF, DOCX, or TXT) or click "Browse Files"
4. The file will be uploaded to the backend for processing
5. View the analysis results displayed on the page

## API Endpoints

### `/predict` (POST)

Uploads a file for analysis by the RAG model.

**Request:**
- Content-Type: multipart/form-data
- Body: file (PDF, DOCX, or TXT)

**Response:**
```json
{
  "success": true,
  "message": "File processed successfully",
  "summary": "Analysis results from the RAG model..."
}
```

## Environment Variables

### Backend

- `CHROMA_DB_DIR`: Directory for ChromaDB vector database
- `MAX_CHUNK_SIZE`: Maximum chunk size for document splitting
- `CHUNK_OVERLAP`: Overlap size for document chunks
- `GROQ_API_KEY`: API key for GROQ LLM service
- `FLASK_ENV`: Flask environment (development/production)
- `PORT`: Port for the Flask server

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Flask, Python
- **RAG Model**: LangChain, ChromaDB, GROQ LLM
- **Document Processing**: LangChain document loaders

## Troubleshooting

- If you encounter CORS issues, ensure the backend has CORS enabled for your frontend URL
- For document processing errors, check that the required dependencies are installed
- If the model fails to load, verify your GROQ API key is correctly set in the `.env` file