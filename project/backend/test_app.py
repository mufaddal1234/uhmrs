from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Test endpoint to verify file upload works
    """
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
        
        # Mock response - just return success for now
        analysis_results = {
            "Summarize the key findings and important information from this document": "This is a test response. The RAG model is being initialized.",
            "Identify any potential audit risks, compliance issues, or red flags": "This is a test response for risk analysis.",
            "What are the main financial metrics or data points mentioned?": "This is a test response for financial metrics."
        }
        
        # Clean up
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        return jsonify({
            'success': True,
            'message': f'File {filename} uploaded successfully. RAG model is initializing...',
            'filename': filename,
            'analysis': analysis_results,
            'document_processed': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/query', methods=['POST'])
def query_document():
    """
    Test endpoint for queries
    """
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'No query provided'}), 400
    
    query = data['query']
    
    return jsonify({
        'success': True,
        'message': 'Query processed successfully (test mode)',
        'query': query,
        'response': f'This is a test response to your query: "{query}". The RAG model is being set up.'
    })

if __name__ == '__main__':
    print("Starting Flask server in test mode...")
    app.run(debug=True, port=5000)