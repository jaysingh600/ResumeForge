import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { Upload as UploadIcon, File, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus("idle");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file || !token) return;
    setStatus("uploading");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("success");
      
      // We pass the parsed data to the builder
      // For now, we'll store it in localStorage or state, but since we navigate, localStorage is easiest or a Zustand store
      localStorage.setItem("resume_parsed_data", JSON.stringify(response.data));
      
      setTimeout(() => {
        navigate("/builder");
      }, 1500);

    } catch (error) {
      setStatus("error");
      setErrorMessage(error.response?.data?.message || "Failed to process the file.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center shrink-0">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Upload Resume</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload your existing resume</h2>
            <p className="text-slate-500">Our AI will extract your details and instantly populate the builder.</p>
          </div>

          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
              } ${isDragReject ? "border-red-500 bg-red-50" : ""}`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <UploadIcon className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">
                {isDragActive ? "Drop the file here..." : "Drag & drop your resume here"}
              </p>
              <p className="text-sm text-slate-500">Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                  <File className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {status === "idle" && (
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setFile(null)}
                    className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Change File
                  </button>
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2.5 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <SparklesIcon className="w-4 h-4" /> Extract with AI
                  </button>
                </div>
              )}

              {status === "uploading" && (
                <div className="flex flex-col items-center text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="font-medium text-slate-900">Our AI is reading your resume...</p>
                  <p className="text-sm text-slate-500 mt-1">This usually takes about 5-10 seconds.</p>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col items-center text-emerald-600">
                  <CheckCircle className="w-10 h-10 mb-4" />
                  <p className="font-bold text-slate-900">Extraction Complete!</p>
                  <p className="text-sm text-slate-500 mt-1">Redirecting to builder...</p>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center text-red-500">
                  <AlertCircle className="w-10 h-10 mb-4" />
                  <p className="font-bold text-slate-900">Extraction Failed</p>
                  <p className="text-sm text-red-500 mt-1 mb-4">{errorMessage}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
