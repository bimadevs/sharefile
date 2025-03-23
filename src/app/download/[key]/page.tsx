import React from 'react'
import FileDownloader from '@/app/components/FileDownloader'

export default function DownloadPage({ params }: { params: { key: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-24">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2">ShareFile</h1>
        <p className="text-center text-gray-500 mb-8">
          Platform berbagi file sederhana dan cepat
        </p>
        
        <FileDownloader fileKey={params.key} />
        
        <div className="mt-16 text-center">
          <a
            href="/"
            className="text-blue-500 hover:underline inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke halaman utama
          </a>
        </div>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ShareFile. Semua hak cipta dilindungi.</p>
        </footer>
      </div>
    </main>
  )
} 