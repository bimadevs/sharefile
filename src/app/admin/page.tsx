'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChartIcon, SearchIcon, TrashIcon } from '../components/Icons'

interface FileWithDownloads {
  id: string
  name: string
  size: number
  mimeType: string
  createdAt: string
  downloads: number
}

interface SearchResult {
  files: FileWithDownloads[]
  total: number
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileWithDownloads[]>([])
  const [totalFiles, setTotalFiles] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch file data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin/files')
        if (!response.ok) {
          throw new Error('Failed to fetch files')
        }
        const data = await response.json()
        
        setFiles(data.files)
        setTotalFiles(data.count)
        setTotalDownloads(data.totalDownloads)
      } catch (error) {
        console.error('Error fetching files:', error)
        setError('Failed to load files. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Handle file delete
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete file')
      }

      // Update local state
      setFiles(files.filter(file => file.id !== fileId))
      setTotalFiles(prev => prev - 1)
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Gagal menghapus file. Silakan coba lagi.')
    }
  }

  // File search component
  const FileSearch = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!searchQuery.trim()) {
        setSearchResults(null)
        return
      }

      try {
        setIsSearching(true)
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`)
        
        if (!response.ok) {
          throw new Error('Failed to search files')
        }
        
        const data = await response.json()
        setSearchResults(data)
      } catch (error) {
        console.error('Error searching files:', error)
        alert('Gagal mencari file. Silakan coba lagi.')
      } finally {
        setIsSearching(false)
      }
    }

    return (
      <div className="mb-10">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari file berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary py-2 px-6 rounded-lg"
            disabled={isSearching}
          >
            {isSearching ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {searchResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Hasil Pencarian</h3>
            
            {searchResults.files.length === 0 ? (
              <div className="card p-6 text-center">
                <p className="text-gray-500">Tidak ada file yang ditemukan untuk "{searchQuery}"</p>
              </div>
            ) : (
              <>
                <p className="mb-3 text-gray-600">Ditemukan {searchResults.total} file untuk "{searchQuery}"</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama File</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diunduh</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Upload</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {searchResults.files.map((file) => (
                        <tr key={file.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                  {file.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{file.downloads}x</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{formatDate(file.createdAt)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600 hover:text-red-800 mr-4"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <Link 
                              href={`/download/${file.id}`} 
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Lihat
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Admin Dashboard
            </h1>
            <Link href="/" className="btn-outline py-2 px-6 rounded-lg text-center">
              Kembali ke Beranda
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card card-hover p-6 rounded-xl flex items-start">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <svg 
                  className="w-6 h-6 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total File</p>
                <h3 className="text-2xl font-bold">{isLoading ? '...' : totalFiles}</h3>
              </div>
            </div>
            
            <div className="card card-hover p-6 rounded-xl flex items-start">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                <ChartIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Download</p>
                <h3 className="text-2xl font-bold">{isLoading ? '...' : totalDownloads}</h3>
              </div>
            </div>
            
            <div className="card card-hover p-6 rounded-xl flex items-start">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <svg 
                  className="w-6 h-6 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Rata-rata Download</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? '...' : totalFiles > 0 ? (totalDownloads / totalFiles).toFixed(1) : '0'}
                </h3>
              </div>
            </div>
          </div>
        </div>
        
        <FileSearch />
        
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">File Terbaru</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Belum ada file yang diupload</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama File</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukuran</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diunduh</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Upload</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                              {file.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{file.downloads}x</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(file.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-600 hover:text-red-800 mr-4"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                        <Link 
                          href={`/download/${file.id}`} 
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Lihat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 