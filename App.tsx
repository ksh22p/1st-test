import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ReportViewer from './components/ReportViewer';
import Visualizations from './components/Visualizations';
import ChatBot from './components/ChatBot';
import { analyzeReport } from './services/geminiService';
import { AnalysisResult } from './types';
import { Download, FileText, BarChart2, Layout, Printer } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'charts'>('report');
  const [isPrinting, setIsPrinting] = useState(false);
  
  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    setResult(null);
    try {
      const data = await analyzeReport(selectedFile);
      setResult(data);
    } catch (error) {
      console.error("Analysis Failed", error);
      alert("보고서 분석에 실패했습니다. API 키나 파일 상태를 확인해주세요.");
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    // Allow React to render both components before printing
    setTimeout(() => {
        window.print();
        // Delay resetting state to allow print dialog to handle the content
        setTimeout(() => setIsPrinting(false), 500);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">KDI Report Analyzer</h1>
        </div>
        
        {result && (
          <div className="flex items-center gap-4">
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'report' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FileText className="w-4 h-4" />
                  요약 보고서
                </button>
                <button 
                  onClick={() => setActiveTab('charts')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'charts' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <BarChart2 className="w-4 h-4" />
                  시각화 데이터
                </button>
             </div>
             <div className="h-6 w-px bg-gray-300 mx-2"></div>
             <button 
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:bg-gray-400"
             >
               <Printer className="w-4 h-4" />
               {isPrinting ? '준비 중...' : 'PDF 인쇄/저장'}
             </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden p-6 relative print:p-0 print:overflow-visible print:h-auto`}>
        {!result ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-lg">
              <h2 className="text-3xl font-bold text-gray-900">KDI 예비타당성조사 분석</h2>
              <p className="text-gray-500">
                PDF 보고서를 업로드하면 KDI 표준 검토안에 따라 <br/>
                핵심 내용 요약과 비용/면적 분석 데이터를 자동으로 추출합니다.
              </p>
            </div>
            <div className="mt-12 w-full">
              <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
            </div>
          </div>
        ) : (
          <div className="h-full max-w-6xl mx-auto flex flex-col print:block print:max-w-none print:h-auto">
             {/* Report View */}
             {(activeTab === 'report' || isPrinting) && (
               <div className={`flex-1 overflow-hidden relative print:overflow-visible print:h-auto print:mb-8`}>
                  <ReportViewer markdown={result.markdownReport} />
               </div>
             )}
             
             {/* Print Spacer */}
             {isPrinting && <div className="hidden print:block h-8"></div>}

             {/* Charts View - Conditionally rendered to prevent Recharts 0-width error */}
             {(activeTab === 'charts' || isPrinting) && (
               <div className={`flex-1 overflow-hidden relative print:overflow-visible print:h-auto`}>
                  <Visualizations data={result.charts} />
               </div>
             )}
          </div>
        )}
      </main>

      <div className="print:hidden">
        <ChatBot file={file} />
      </div>
    </div>
  );
}

export default App;