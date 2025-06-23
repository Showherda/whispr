'use client'
import React, { useState, ChangeEvent, useRef } from 'react';
import api from '../lib/api';

interface FileUploaderProps {
  label?: string;
}

export default function FileUploader({ label = "Upload audio file for transcription" }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [transcript, setTranscript] = useState<string>('');

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    api.post('/api/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (ev) => {
        if (ev.total) setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    })
    .then(res => {
      setStatus('Completed');
      setTranscript(res.data.transcript);
    })
    .catch(() => {
      setStatus('Error during upload/transcription');
    });
  }

  const reset = () => {
    setProgress(0);
    setStatus('');
    setTranscript('');
    fileInputRef.current!.value = '';
  }

  return (
    <div className="bg-white p-6 rounded-md shadow-md space-y-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFile}
        className="block w-full text-gray-700"
      />
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded overflow-hidden">
          <div className="bg-blue-500 text-xs text-white text-center" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
      {status && <p className="text-sm text-gray-500">{status}</p>}
      {transcript && (
        <>
          <h3 className="text-lg font-semibold">Transcript</h3>
          <p className="text-gray-700 whitespace-pre-line">{transcript}</p>
          <button onClick={reset} className="mt-4 text-blue-600 underline">Upload another</button>
        </>
      )}
    </div>
  );
}
