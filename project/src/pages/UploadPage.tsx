import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  file?: File;
}

interface PredictionResult {
  success: boolean;
  message: string;
  filename?: string;
  analysis?: {
    [key: string]: string;
  };
  document_processed?: boolean;
  error?: string;
}

interface QueryResult {
  success: boolean;
  message: string;
  query: string;
  response: string;
  error?: string;
}

const UploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateFileId = (): string => {
    return Math.random().toString(36).substr(2, 9);
  };

  const uploadFileToBackend = async (file: File, fileId: string) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Update progress to show upload started
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 10 }
            : f
        )
      );
      
      // Make API call to backend
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });
      
      // Update progress to 50%
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: 50 }
            : f
        )
      );
      
      const result = await response.json();
      
      // Update file status based on API response
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: response.ok ? 'completed' : 'error', 
                progress: 100 
              }
            : f
        )
      );
      
      // Set prediction result
      setPredictionResult(result);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Update file status to error
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', progress: 100 }
            : f
        )
      );
      
      setPredictionResult({
        success: false,
        message: 'Failed to process file',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setIsLoading(false);
    }
  };

  const handleFiles = (files: FileList) => {
    // Only process the first file for simplicity
    if (files.length > 0) {
      const file = files[0];
      const fileId = generateFileId();
      
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        file: file
      };
      
      setUploadedFiles([newFile]);
      setPredictionResult(null);
      setQueryResult(null);
      setQuery('');
      
      // Upload the file to backend
      uploadFileToBackend(file, fileId);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleQuery = async () => {
    if (!query.trim() || !predictionResult?.document_processed) {
      return;
    }

    setIsQuerying(true);
    setQueryResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const result = await response.json();
      setQueryResult(result);
    } catch (error) {
      console.error('Error querying document:', error);
      setQueryResult({
        success: false,
        message: 'Failed to query document',
        query: query,
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsQuerying(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setPredictionResult(null);
    setQueryResult(null);
    setQuery('');
  };

  const handleSubmit = () => {
    // If there's a file with the file object, upload it
    const fileToUpload = uploadedFiles.find(file => file.file);
    if (fileToUpload && fileToUpload.file) {
      uploadFileToBackend(fileToUpload.file, fileToUpload.id);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Audit Document Analysis</h1>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-xl mb-2">Drag and drop your audit document here</p>
        <p className="text-gray-500 mb-4">Supported formats: PDF, DOCX, TXT</p>
        <button 
          onClick={openFileDialog}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Browse Files
        </button>
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.docx,.txt"
        />
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Document</h2>
          <div className="space-y-4">
            {uploadedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-4">
                    <File className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {file.status === 'uploading' && (
                    <div className="flex items-center mr-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{Math.round(file.progress)}%</span>
                    </div>
                  )}
                  
                  {file.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-4" />
                  )}
                  
                  {file.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-4" />
                  )}
                  
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {uploadedFiles.length > 0 && uploadedFiles[0].status !== 'completed' && (
            <div className="mt-4">
              <button 
                onClick={handleSubmit}
                disabled={isLoading || uploadedFiles[0].status === 'error'}
                className={`w-full py-2 px-4 rounded font-medium ${
                  isLoading || uploadedFiles[0].status === 'error'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </span>
                ) : 'Analyze Document'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {predictionResult && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {predictionResult.error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error: {predictionResult.error}</p>
              <p className="text-red-600 mt-2">{predictionResult.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">Document Processed Successfully</p>
                <p className="text-green-600">{predictionResult.message}</p>
                {predictionResult.filename && (
                  <p className="text-green-600 text-sm mt-1">File: {predictionResult.filename}</p>
                )}
              </div>
              
              {predictionResult.analysis && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Automated Analysis</h3>
                  {Object.entries(predictionResult.analysis).map(([question, answer], index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{question}</h4>
                      <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {predictionResult?.document_processed && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ask Questions About Your Document</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question about your document..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isQuerying) {
                    handleQuery();
                  }
                }}
              />
              <button
                onClick={handleQuery}
                disabled={isQuerying || !query.trim()}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isQuerying || !query.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isQuerying ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Asking...
                  </span>
                ) : 'Ask'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Example questions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>"What are the main financial highlights?"</li>
                <li>"Are there any compliance issues mentioned?"</li>
                <li>"What recommendations does the audit suggest?"</li>
                <li>"Explain the key risks identified"</li>
                <li>"Summarize the audit findings"</li>
                <li>"What are the internal control weaknesses?"</li>
              </ul>
            </div>
          </div>
          
          {queryResult && (
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-3">Query Response</h3>
              
              {queryResult.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Error: {queryResult.error}</p>
                  <p className="text-red-600 mt-1">{queryResult.message}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-medium">Question:</p>
                    <p className="text-blue-700">{queryResult.query}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-800 font-medium mb-2">Answer:</p>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {queryResult.response}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadPage;