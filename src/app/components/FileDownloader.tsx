'use client'

import React, { useState, useEffect, useRef } from 'react'
import { formatFileSize, formatSpeed, formatETA } from '../lib/utils'
import ProgressBar from './ProgressBar'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'

interface FileInfo {
  id: string
  name: string
  originalName: string
  size: number
  mimeType: string
  createdAt: string
}

interface DownloadStatus {
  progress: number
  speed: number
  eta: number
  downloaded: number
  fileSize: number
  status: 'idle' | 'downloading' | 'completed' | 'error'
  error: string | null
}

interface FileDownloaderProps {
  fileKey: string
}

const FileDownloader: React.FC<FileDownloaderProps> = ({ fileKey }) => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    progress: 0,
    speed: 0,
    eta: 0,
    downloaded: 0,
    fileSize: 0,
    status: 'idle',
    error: null,
  })
  const socketRef = useRef<Socket | null>(null)
  const downloadStartTimeRef = useRef<number>(0)

  // Mengambil informasi file saat komponen dimuat
  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await axios.get(`/api/download/${fileKey}/info`)
        if (response.status === 200) {
          setFileInfo(response.data)
        }
      } catch (error) {
        console.error('Error fetching file info:', error)
        setDownloadStatus(prev => ({
          ...prev,
          status: 'error',
          error: 'File tidak ditemukan atau tidak dapat diakses.',
        }))
      }
    }

    fetchFileInfo()
  }, [fileKey])

  // Setup socket connection untuk progress download
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io({
        path: '/api/socket',
      })

      socketRef.current.on('downloadProgress', (data: {
        progress: number
        downloaded: number
        fileSize: number
        speed: number
        eta: number
      }) => {
        setDownloadStatus(prev => ({
          ...prev,
          progress: data.progress,
          downloaded: data.downloaded,
          fileSize: data.fileSize || 0,
          speed: data.speed,
          eta: data.eta,
        }))
      })

      socketRef.current.on('downloadComplete', () => {
        setDownloadStatus(prev => ({
          ...prev,
          progress: 100,
          status: 'completed',
        }))
      })

      socketRef.current.on('downloadError', (error: string) => {
        setDownloadStatus(prev => ({
          ...prev,
          status: 'error',
          error: error,
        }))
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  // Memulai download file
  const startDownload = async () => {
    if (!fileInfo) return

    try {
      setDownloadStatus(prev => ({
        ...prev,
        status: 'downloading',
        progress: 0,
        downloaded: 0,
        error: null,
      }))

      downloadStartTimeRef.current = Date.now()

      // Beri tahu server bahwa kita akan mulai download
      socketRef.current?.emit('startDownload', { fileKey })

      // Perbaikan metode download dengan menggunakan pendekatan <a> element
      const downloadLink = document.createElement('a')
      downloadLink.href = `/api/download/${fileKey}`
      downloadLink.download = fileInfo.originalName || 'download'
      downloadLink.target = '_blank'
      document.body.appendChild(downloadLink)
      
      // Klik tautan untuk memulai unduhan
      downloadLink.click()
      
      // Hapus elemen setelah digunakan
      document.body.removeChild(downloadLink)

      // Simulasi progress untuk UI
      let progressValue = 0
      const progressInterval = setInterval(() => {
        progressValue = Math.min(progressValue + 5, 95)
        
        const elapsedTime = (Date.now() - downloadStartTimeRef.current) / 1000
        const downloadSpeed = (progressValue / 100) * fileInfo.size / elapsedTime
        const remainingBytes = fileInfo.size - ((progressValue / 100) * fileInfo.size)
        const eta = downloadSpeed > 0 ? remainingBytes / downloadSpeed : 0
        
        setDownloadStatus(prev => ({
          ...prev,
          progress: progressValue,
          downloaded: (progressValue / 100) * fileInfo.size,
          fileSize: fileInfo.size,
          speed: downloadSpeed,
          eta: eta,
        }))
        
        if (progressValue >= 95) {
          clearInterval(progressInterval)
          
          // Setelah beberapa detik, anggap unduhan selesai
          setTimeout(() => {
            setDownloadStatus(prev => ({
              ...prev,
              progress: 100,
              status: 'completed',
              downloaded: fileInfo.size,
            }))
          }, 2000)
        }
      }, 300)
    } catch (error) {
      console.error('Error downloading file:', error)
      setDownloadStatus(prev => ({
        ...prev,
        status: 'error',
        error: 'Gagal download file. Silakan coba lagi.',
      }))
    }
  }

  // Status download idle/loading
  if (!fileInfo && downloadStatus.status !== 'error') {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-2">Memuat informasi file...</p>
        </div>
      </div>
    )
  }

  // Status error
  if (downloadStatus.status === 'error') {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{downloadStatus.error || 'Terjadi kesalahan saat memuat file.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Download File</h2>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">{fileInfo?.originalName}</p>
            <p className="text-sm text-gray-500">
              {fileInfo ? formatFileSize(fileInfo.size) : ''}
            </p>
            <p className="text-xs text-gray-500">
              Diupload pada {fileInfo ? new Date(fileInfo.createdAt).toLocaleString() : ''}
            </p>
          </div>
        </div>
      </div>

      {(downloadStatus.status === 'downloading' || downloadStatus.status === 'completed') && (
        <div className="mb-6">
          <ProgressBar
            progress={downloadStatus.progress}
            speed={formatSpeed(downloadStatus.speed)}
            eta={downloadStatus.status === 'downloading' ? formatETA(downloadStatus.eta) : 'Selesai'}
          />
        </div>
      )}

      {downloadStatus.status === 'completed' ? (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-6 text-center">
          <p>File berhasil didownload!</p>
        </div>
      ) : (
        <button
          onClick={startDownload}
          disabled={downloadStatus.status === 'downloading'}
          className={`w-full py-3 px-4 rounded-lg ${
            downloadStatus.status === 'downloading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-medium transition-colors flex items-center justify-center`}
        >
          {downloadStatus.status === 'downloading' ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download File
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default FileDownloader 