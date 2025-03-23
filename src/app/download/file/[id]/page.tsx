'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DownloadIcon, CheckIcon } from '../../../components/Icons'

interface DownloadPageProps {
  params: {
    id: string
  }
}

interface FileData {
  id: string
  name: string
  size: number
  key?: string
}

interface DownloadStatus {
  isDownloading: boolean
  progress: number
  downloaded: number
  speed: number
  eta: number
  completed: boolean
  error: string | null
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const { id } = params
  const [fileData, setFileData] = useState<FileData | null>(null)
  const [fileKey, setFileKey] = useState<string>('')
  const [notFound, setNotFound] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    isDownloading: false,
    progress: 0,
    downloaded: 0,
    speed: 0,
    eta: 0,
    completed: false,
    error: null
  })

  // Format file size untuk tampilan
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format speed download
  const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond === 0) return '0 B/s'
    const k = 1024
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format estimated time of arrival
  const formatETA = (seconds: number) => {
    if (!seconds || !isFinite(seconds) || seconds < 0) return '-'
    if (seconds < 60) return `${Math.floor(seconds)} detik`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit ${Math.floor(seconds % 60)} detik`
    return `${Math.floor(seconds / 3600)} jam ${Math.floor((seconds % 3600) / 60)} menit`
  }

  // Mengambil informasi file
  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const response = await fetch(`/api/files/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
          }
          throw new Error('Failed to fetch file info')
        }

        const data = await response.json()
        setFileData(data.file)
        
        // Dapatkan file key dari database
        if (data.file.key) {
          setFileKey(data.file.key)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error fetching file info:', error)
      }
    }

    fetchFileInfo()
  }, [id])

  // Memulai download file
  const handleDownload = async () => {
    if (!fileData || !fileKey) return

    try {
      setDownloadStatus({
        ...downloadStatus,
        isDownloading: true,
        progress: 0,
        downloaded: 0,
        speed: 0,
        eta: 0,
        completed: false,
        error: null
      })

      const startTime = Date.now()
      
      // Buat elemen tautan yang tidak terlihat
      const downloadLink = document.createElement('a')
      // URL untuk mengunduh file
      const downloadUrl = `/api/download/${fileKey}`
      downloadLink.href = downloadUrl
      downloadLink.target = '_blank'
      downloadLink.download = fileData.name || 'download'
      document.body.appendChild(downloadLink)
      
      // Simulasi progres download
      const progressInterval = setInterval(() => {
        const elapsedMs = Date.now() - startTime
        const progressValue = Math.min(Math.floor((elapsedMs / 3000) * 100), 99)
        
        // Perkiraan kecepatan berdasarkan ukuran file dan waktu
        const elapsedSeconds = elapsedMs / 1000
        const estimatedProgress = progressValue / 100
        const downloadedBytes = estimatedProgress * fileData.size
        const speed = downloadedBytes / elapsedSeconds
        
        // Perkiraan waktu tersisa
        const remainingBytes = fileData.size - downloadedBytes
        const eta = speed > 0 ? remainingBytes / speed : 0
        
        setDownloadStatus(prev => ({
          ...prev,
          progress: progressValue,
          downloaded: downloadedBytes,
          speed: speed,
          eta: eta
        }))
        
        if (progressValue >= 99) {
          clearInterval(progressInterval)
        }
      }, 200)
      
      // Klik tautan untuk memulai unduhan
      downloadLink.click()
      
      // Hapus elemen tautan setelah digunakan
      document.body.removeChild(downloadLink)
      
      // Catat download di server setelah beberapa saat
      // (menganggap pengguna memiliki cukup waktu untuk memulai unduhan)
      setTimeout(async () => {
        try {
          await fetch(`/api/files/${id}/increment-downloads`, {
            method: 'POST'
          })
        } catch (error) {
          console.error('Error recording download:', error)
        }
        
        // Setelah interval, anggap unduhan selesai
        clearInterval(progressInterval)
        
        setDownloadStatus(prev => ({
          ...prev,
          isDownloading: false,
          progress: 100,
          completed: true,
          downloaded: fileData.size
        }))
      }, 3000)
      
    } catch (error) {
      console.error('Error downloading file:', error)
      setDownloadStatus(prev => ({
        ...prev,
        isDownloading: false,
        error: 'Terjadi kesalahan saat mendownload file'
      }))
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="card card-hover text-center max-w-lg w-full p-8 rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-4">File Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">
            File yang Anda cari mungkin telah dihapus atau link sudah tidak valid.
          </p>
          <Link href="/" className="btn-primary py-2 px-6 rounded-lg inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 flex flex-col items-center px-4">
      <div className="card card-hover max-w-lg w-full p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600">
            <DownloadIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold mb-1">Download File</h1>
          {fileData && (
            <div className="text-gray-600">
              <p className="mb-1 text-lg font-medium">{fileData.name}</p>
              <p>{formatFileSize(fileData.size)}</p>
            </div>
          )}
        </div>

        {downloadStatus.error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-red-600">
            {downloadStatus.error}
          </div>
        )}

        {downloadStatus.isDownloading ? (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm">
              <span>{downloadStatus.progress}% Selesai</span>
              <span>{formatFileSize(downloadStatus.downloaded)} / {fileData ? formatFileSize(fileData.size) : '0 B'}</span>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${downloadStatus.progress}%` }}></div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                Kecepatan: <span className="font-medium">{formatSpeed(downloadStatus.speed)}</span>
              </div>
              <div>
                Sisa Waktu: <span className="font-medium">{formatETA(downloadStatus.eta)}</span>
              </div>
            </div>
          </div>
        ) : downloadStatus.completed ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 text-green-600">
              <CheckIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Download Selesai!</h2>
            <p className="text-gray-600 mb-6">
              File berhasil diunduh ke perangkat Anda.
            </p>
            <Link href="/" className="btn-secondary py-2 px-6 rounded-lg inline-block">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Klik tombol di bawah ini untuk mulai mengunduh file
            </p>
            <button
              onClick={handleDownload}
              className="btn-primary py-3 px-8 rounded-lg inline-flex items-center"
              disabled={!fileData}
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              <span>Download Sekarang</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 