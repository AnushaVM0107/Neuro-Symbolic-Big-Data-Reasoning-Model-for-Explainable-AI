
import React, { useRef, useCallback, useState } from 'react';
import { UploadCloudIcon, CheckCircleIcon } from './IconComponents';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fileName: string | null;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fileName, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelect(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  }, [onFileSelect]);


  return (
    <div className="w-full group">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-48 px-6 transition-all duration-300 border-2 border-dashed rounded-[2rem] cursor-pointer overflow-hidden ${isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99] shadow-inner'
            : fileName
              ? 'border-green-400 bg-green-50/30'
              : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100'
          }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={`p-4 rounded-2xl mb-4 transition-all duration-500 ${fileName ? 'bg-green-100/50 text-green-600 scale-110' : 'bg-white text-indigo-500 group-hover:scale-110 shadow-sm'
          }`}>
          {fileName ? (
            <CheckCircleIcon className="w-10 h-10" />
          ) : (
            <UploadCloudIcon className="w-10 h-10 transition-transform group-hover:-translate-y-1" />
          )}
        </div>

        <div className="text-center space-y-1">
          <p className={`text-lg font-bold font-heading ${fileName ? 'text-green-700' : 'text-slate-700'}`}>
            {fileName ? fileName : 'Upload Dataset'}
          </p>
          <p className="text-sm text-slate-400 font-medium">
            {fileName ? 'Click or drag to replace' : 'Drop your CSV file here or click to browse'}
          </p>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-indigo-500/5 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full border-4 border-indigo-500/20 rounded-[2rem] animate-pulse"></div>
          </div>
        )}

        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
      </label>
    </div>
  );
};
