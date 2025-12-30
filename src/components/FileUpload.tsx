import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }
    setFileName(file.name);
    onFileSelect(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 ease-in-out
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isAnalyzing ? onButtonClick : undefined}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept="application/pdf"
          disabled={isAnalyzing}
        />

        {isAnalyzing ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-blue-600">보고서 분석 중입니다...</p>
            <p className="text-xs text-gray-400 mt-1">시간이 조금 걸릴 수 있습니다 (약 30초~1분)</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700">{fileName}</p>
            <p className="text-sm text-gray-500 mt-1">클릭하여 다른 파일 선택</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-lg font-semibold text-gray-700">PDF 보고서 업로드</p>
            <p className="text-sm text-gray-500 mt-1">파일을 드래그하거나 클릭하여 선택하세요</p>
          </div>
        )}
      </div>
      
      {!isAnalyzing && !fileName && (
        <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p>KDI 예비타당성조사 보고서(PDF)를 업로드하면 AI가 '학습용 스크립트'에 맞춰 자동으로 분석 및 시각화합니다.</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
