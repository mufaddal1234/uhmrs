from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import tempfile
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the RAG model directory to the path
rag_model_path = os.path.join(os.path.dirname(__file__), '..', 'Audit-GPT', 'RAG model')
sys.path.append(rag_model_path)
print(f"Added to path: {rag_model_path}")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running',
        'rag_initialized': doc_processor is not None and audit_assistant is not None
    })

# Initialize components
print("Starting server initialization...")
doc_processor = None
audit_assistant = None

# Try to initialize RAG components
def initialize_rag_components():
    global doc_processor, audit_assistant
    try:
        print("Initializing RAG model components (this may take a moment)...")
        
        from document_processor import DocumentProcessor
        from audit_assistant import AuditAssistant
        
        doc_processor = DocumentProcessor()
        print("Document processor initialized")
        
        audit_assistant = AuditAssistant()
        print("Audit assistant initialized")
        
        # Check if the API key is properly set
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key or api_key in ['your_groq_api_key_here', 'temp_key_for_testing']:
            print("[WARNING] GROQ API key not properly set. Running in basic mode.")
        else:
            print("[INFO] GROQ API key found. Full functionality available.")
        
        print("RAG model components initialized successfully")
        return True
        
    except Exception as e:
        print(f"Error initializing RAG components: {e}")
        print("Server will run in basic mode. Please check your environment setup.")
        return False

# Try to initialize (but don't block server startup)
rag_initialized = initialize_rag_components()

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to process uploaded files and get predictions from the RAG model
    Accepts PDF, DOCX, and TXT files
    """
    if not doc_processor or not audit_assistant:
        # Try to initialize if not already done
        if not initialize_rag_components():
            return jsonify({
                'success': False,
                'error': 'RAG model not properly initialized.',
                'message': 'Please check your GROQ API key setup',
                'instructions': 'Get your free API key from https://console.groq.com/keys and update the .env file'
            }), 500
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check file extension
    allowed_extensions = {'pdf', 'docx', 'txt'}
    file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    
    if file_ext not in allowed_extensions:
        return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}'}), 400
    
    try:
        # Save the file temporarily
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        # Process the file
        success, message = doc_processor.process_pdf(temp_path)
        
        if not success:
            return jsonify({'error': message}), 500
        
        # Get comprehensive analysis
        queries = [
            "Summarize the key findings and important information from this document",
            "Identify any potential audit risks, compliance issues, or red flags",
            "What are the main financial metrics or data points mentioned?"
        ]
        
        analysis_results = {}
        for query in queries:
            context_docs = doc_processor.search_documents(query)
            response = audit_assistant.process_query(query, context_docs)
            analysis_results[query] = response
        
        # Clean up
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        return jsonify({
            'success': True,
            'message': message,
            'filename': filename,
            'analysis': analysis_results,
            'document_processed': True
        })
        
    except Exception as e:
        # Clean up on error
        try:
            if 'temp_path' in locals() and os.path.exists(temp_path):
                os.remove(temp_path)
            if 'temp_dir' in locals() and os.path.exists(temp_dir):
                os.rmdir(temp_dir)
        except:
            pass
        return jsonify({'error': str(e)}), 500

@app.route('/query', methods=['POST'])
def query_document():
    """
    Endpoint to query the processed documents with custom questions
    """
    if not doc_processor or not audit_assistant:
        # Try to initialize if not already done
        if not initialize_rag_components():
            return jsonify({
                'success': False,
                'error': 'RAG model not properly initialized.',
                'message': 'Please check your GROQ API key setup',
                'instructions': 'Get your free API key from https://console.groq.com/keys and update the .env file'
            }), 500
    
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'No query provided'}), 400
    
    query = data['query']
    
    try:
        # Search for relevant documents
        context_docs = doc_processor.search_documents(query)
        
        if not context_docs:
            return jsonify({
                'success': False,
                'message': 'No documents found. Please upload a document first.',
                'response': ''
            })
        
        # Get response from audit assistant
        response = audit_assistant.process_query(query, context_docs)
        
        return jsonify({
            'success': True,
            'message': 'Query processed successfully',
            'query': query,
            'response': response
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 Audit-GPT Backend Server Starting")
    print("="*50)
    print(f"✅ Server will run on: http://127.0.0.1:5000")
    print(f"✅ RAG Components: {'Initialized' if rag_initialized else 'Not initialized (check GROQ API key)'}")
    if not rag_initialized:
        print("⚠️  To enable full functionality:")
        print("   1. Get your free API key from: https://console.groq.com/keys")
        print("   2. Update your .env file with the real API key")
        print("   3. Restart the server")
    print("="*50 + "\n")
    app.run(debug=True, port=5000)