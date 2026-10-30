import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { analyzeDocumentRequirement } from '../services/aiService';
import {
  Upload,
  FileText,
  Image,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
  FileUp,
  Sparkles,
  Loader2,
  Info,
  Lock,
} from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const UploadPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileChange = (file: File) => {
    setErrorMessage(null);

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('File size exceeds the 5 MB limit. Please select a smaller file.');
      return;
    }

    // Validate type
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'text/plain',
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      setErrorMessage('Unsupported file format. Please upload a PDF, JPG, PNG, or TXT file.');
      return;
    }

    setSelectedFile(file);

    // Create preview for image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to analyze.');
      return;
    }
    if (!hasConsent) {
      setErrorMessage('Please confirm the privacy statement before proceeding.');
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzeDocumentRequirement(selectedFile, description, language);
      // Navigate to assistant with the matched service
      navigate(
        `/assistant?service=${encodeURIComponent(result.serviceId || result.serviceName)}`
      );
    } catch (err) {
      console.error('Failed to analyze document:', err);
      setErrorMessage('Failed to analyze the document. Please try again or describe your requirement in text.');
      setAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A2240] border border-blue-200 text-xs font-semibold">
          <FileUp className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>Requirement & Document Analyzer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2240] tracking-tight">
          {t.uploadTitle}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t.uploadDescription}
        </p>
      </div>

      {/* Strict Privacy & Security Banner */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">
              Important Citizen Security & Privacy Notice
            </h4>
            <p className="text-xs leading-relaxed text-amber-800">
              {t.uploadWarning}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-200/60 text-amber-950 font-medium">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#138808]" />
            <span>Files are analyzed in-session only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#138808]" />
            <span>Never stored on external databases</span>
          </div>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        {/* Dropzone */}
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#FF9933] bg-amber-50/50 scale-[1.01]'
                : 'border-gray-300 hover:border-[#0A2240] hover:bg-gray-50/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0A2240] flex items-center justify-center">
                <Upload className="w-7 h-7 text-[#FF9933]" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">
                  Click to browse or drag and drop your file here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG, TXT (Maximum: 5 MB)
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold"
              >
                Select File
              </button>
            </div>
          </div>
        ) : (
          /* File Preview Card */
          <div className="p-4 sm:p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedFile.type.startsWith('image/') ? (
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0A2240] flex items-center justify-center shrink-0">
                    <Image className="w-6 h-6 text-[#FF9933]" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-amber-700" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 break-all">{selectedFile.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Plain Text'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-200 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail Preview if Image */}
            {filePreview && (
              <div className="pt-2">
                <div className="relative max-w-xs max-h-48 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                  <img
                    src={filePreview}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optional Description Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
            {t.optionalDescription}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g. I received this electricity bill and need a domicile certificate for my son's college admission..."
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2240]"
          />
        </div>

        {/* Mandatory Security & Consent Checkbox */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#0A2240] focus:ring-[#0A2240]"
            />
            <span className="text-xs text-gray-700 leading-relaxed">
              <strong>Citizen Privacy Consent:</strong> I confirm this uploaded document does not
              contain unmasked full Aadhaar numbers, net banking passwords, or OTPs. I consent to
              client-side analysis solely to identify the matching government service.
            </span>
          </label>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !selectedFile || !hasConsent}
            className="w-full py-4 rounded-xl bg-[#0A2240] hover:bg-[#163864] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-md shadow-blue-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.loading}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#FF9933]" />
                <span>{t.analyzeDocument}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Examples Section */}
      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Common Documents You Can Upload:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-700">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <strong>Electricity / Water Bill</strong>
            <p className="text-gray-500 mt-0.5">Identifies address proof for Domicile or Ration Card</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <strong>School Leaving Certificate</strong>
            <p className="text-gray-500 mt-0.5">Identifies Caste / Domicile eligibility requirements</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <strong>Salary Slip / Form 16</strong>
            <p className="text-gray-500 mt-0.5">Identifies Income / Non-Creamy Layer threshold</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
