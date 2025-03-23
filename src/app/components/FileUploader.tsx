'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import ProgressBar from './ProgressBar'

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error'
  progress: number
  error: string | null
  fileName: string | null
  fileSize: number | null
  fileId: string | null
  fileKey: string | null
  speed: number
  startTime: number | null
}

interface FileData {
  id: string
  key: string
  name: string
  size: number
  createdAt: string
}

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    error: null,
    fileName: null,
    fileSize: null,
    fileId: null,
    fileKey: null,
    speed: 0,
    startTime: null
  })
  const [fileData, setFileData] = useState<FileData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState('-')
  const [speedDisplay, setSpeedDisplay] = useState('-')
  
  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  // Format speed
  const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond === 0) return '0 B/s'
    const k = 1024
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }
  
  // Format estimated time
  const formatETA = (seconds: number) => {
    if (!seconds || !isFinite(seconds) || seconds < 0) return '-'
    if (seconds < 60) return `${Math.floor(seconds)} dtk`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mnt ${Math.floor(seconds % 60)} dtk`
    return `${Math.floor(seconds / 3600)} jam ${Math.floor((seconds % 3600) / 60)} mnt`
  }
  
  // Update speed and ETA during upload
  useEffect(() => {
    if (uploadState.status === 'uploading' && uploadState.startTime !== null) {
      // Set initial values immediately to ensure they appear
      if (uploadState.fileSize) {
        // Set initial speed (assuming 1% of file uploaded in first second)
        const initialUploadedBytes = (uploadState.progress / 100) * uploadState.fileSize
        const initialSpeed = initialUploadedBytes > 0 ? initialUploadedBytes : uploadState.fileSize * 0.01
        setSpeedDisplay(formatSpeed(initialSpeed))
        
        // Set initial ETA
        const initialEta = uploadState.fileSize / initialSpeed
        setEstimatedTimeLeft(formatETA(initialEta))
      }
      
      const interval = setInterval(() => {
        const elapsedSeconds = (Date.now() - uploadState.startTime!) / 1000
        if (elapsedSeconds > 0 && uploadState.fileSize) {
          // Calculate speed (bytes uploaded per second)
          const uploadedBytes = (uploadState.progress / 100) * uploadState.fileSize
          const currentSpeed = uploadedBytes / elapsedSeconds
          
          // Calculate ETA (remaining time in seconds)
          const remainingBytes = uploadState.fileSize - uploadedBytes
          const eta = currentSpeed > 0 ? remainingBytes / currentSpeed : 0
          
          // Update displays
          setSpeedDisplay(formatSpeed(currentSpeed))
          setEstimatedTimeLeft(formatETA(eta))
          
          // For debugging
          console.log("Speed:", formatSpeed(currentSpeed), "ETA:", formatETA(eta))
        }
      }, 500) // Update more frequently
      
      return () => clearInterval(interval)
    }
  }, [uploadState.status, uploadState.progress, uploadState.startTime, uploadState.fileSize])
  
  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  
  // Handle drag leave event
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])
  
  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
    }
  }, [])
  
  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }
  
  // Handle file upload
  const handleUpload = async () => {
    if (!file) return
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      // Reset displays
      setSpeedDisplay('-')
      setEstimatedTimeLeft('-')
      
      // Set start time first to ensure it's available for calculations
      const currentTime = Date.now()
      
      setUploadState({
        status: 'uploading',
        progress: 0,
        error: null,
        fileName: file.name,
        fileSize: file.size,
        fileId: null,
        fileKey: null,
        speed: 0,
        startTime: currentTime
      })
      
      // Simulasi progress upload - dengan progress lebih bertahap
      const progressInterval = setInterval(() => {
        setUploadState(prevState => {
          if (prevState.progress >= 99) {
            clearInterval(progressInterval)
            return prevState
          }
          
          // Progress lebih lambat dan bertahap untuk simulasi yang lebih realistis
          const increment = Math.min(2 + Math.random() * 3, 10) // Antara 2-5% per interval
          
          return {
            ...prevState,
            progress: Math.min(prevState.progress + increment, 99)
          }
        })
      }, 800) // Interval yang lebih lambat untuk simulasi yang lebih realistis
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      clearInterval(progressInterval)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Upload failed')
      }
      
      const data = await response.json()
      setFileData(data)
      
      setUploadState({
        status: 'success',
        progress: 100,
        error: null,
        fileName: file.name,
        fileSize: file.size,
        fileId: data.id,
        fileKey: data.key,
        speed: 0,
        startTime: null
      })
    } catch (error) {
      console.error('Upload error:', error)
      setUploadState(prevState => ({
        ...prevState,
        status: 'error',
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah file',
        speed: 0,
        startTime: null
      }))
    }
  }
  
  // Handle copy link button
  const handleCopyLink = () => {
    if (!fileData) return
    
    // Gunakan ID file untuk URL download
    const downloadUrl = `${window.location.origin}/download/file/${fileData.id}`
    
    navigator.clipboard.writeText(downloadUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
      })
  }
  
  // Tampilkan informasi setelah upload selesai
  if (uploadState.status === 'success' && fileData) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-2">Upload Berhasil!</h2>
        <p className="text-center text-gray-600 mb-4">File Anda telah berhasil diunggah dan siap dibagikan.</p>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <p className="font-medium mb-1">{fileData.name}</p>
          <p className="text-sm text-gray-500">{formatBytes(fileData.size)}</p>
        </div>
        
        <div className="relative mb-6">
          <input 
            type="text" 
            readOnly 
            value={`${window.location.origin}/download/file/${fileData.id}`}
            className="w-full p-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <button 
            onClick={handleCopyLink}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
          >
            {copied ? 'Tersalin!' : 'Salin'}
          </button>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => {
              setUploadState({
                status: 'idle',
                progress: 0,
                error: null,
                fileName: null,
                fileSize: null,
                fileId: null,
                fileKey: null,
                speed: 0,
                startTime: null
              })
              setFile(null)
              setFileData(null)
            }}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Unggah File Lain
          </button>
        </div>
      </div>
    )
  }
  
  // Tampilkan progress upload
  if (uploadState.status === 'uploading') {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold text-center mb-6">Mengunggah File</h2>
        
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <p className="font-medium mb-1">{uploadState.fileName}</p>
          <p className="text-sm text-gray-500">{formatBytes(uploadState.fileSize || 0)}</p>
        </div>
        
        <div className="mb-2">
          <ProgressBar 
            progress={Math.round(uploadState.progress)} 
            speed={speedDisplay}
            eta={estimatedTimeLeft}
            showStats={true} // Pastikan showStats selalu true
          />
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-2">
          {Math.round(uploadState.progress)}% • Mohon jangan tutup jendela ini
        </p>
      </div>
    )
  }
  
  // Tampilkan error
  if (uploadState.status === 'error') {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 text-red-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-2">Gagal Mengunggah</h2>
        
        <div className="p-4 bg-red-50 rounded-lg mb-6 text-center text-red-600">
          {uploadState.error || 'Terjadi kesalahan saat mengunggah file. Silakan coba lagi.'}
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => {
              setUploadState({
                status: 'idle',
                progress: 0,
                error: null,
                fileName: null,
                fileSize: null,
                fileId: null,
                fileKey: null,
                speed: 0,
                startTime: null
              })
            }}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }
  
  // Form upload default
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-xl font-semibold text-center mb-6">Upload File</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="mb-4 flex justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <p className="text-gray-700 mb-1">
          {isDragging 
            ? 'Lepaskan file di sini' 
            : 'Tarik & lepaskan file di sini atau klik untuk memilih'}
        </p>
        <p className="text-sm text-gray-500">
          (Ukuran maksimum 100MB)
        </p>
      </div>
      
      {file && (
        <div className="mb-6">
          <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between mb-4">
            <div className="truncate pr-4">
              <p className="font-medium mb-1 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button 
            onClick={handleUpload}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Upload File
          </button>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500">
        <p>File Anda akan tersimpan selama 7 hari</p>
      </div>
    </div>
  )
}

export default FileUploader 