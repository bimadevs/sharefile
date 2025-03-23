import FileUploader from './components/FileUploader'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 md:px-8">
      {/* Header dengan gradient */}
      <div className="mb-16 text-center relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative mx-auto max-w-4xl pb-12">
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            ShareFile
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Platform berbagi file modern dengan antarmuka yang intuitif. Upload, bagikan, dan download dengan mudah.
          </p>
        </div>
      </div>
      
      {/* Container utama */}
      <div className="max-w-4xl mx-auto">
        {/* File uploader component */}
        <div className="mb-20">
          <FileUploader />
        </div>
        
        {/* Feature section */}
        {/* <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">Fitur Utama</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ShareFile dirancang untuk memberikan pengalaman berbagi file yang cepat dan mudah dengan antarmuka yang profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card card-hover p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-5">
                <svg 
                  className="w-7 h-7" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Intuitif</h3>
              <p className="text-gray-600">
                Cukup tarik dan lepaskan file anda atau pilih dari perangkat. Mendukung file hingga 100MB dengan progress bar real-time.
              </p>
            </div>
            
            <div className="card card-hover p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-5">
                <svg 
                  className="w-7 h-7" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Berbagi Instan</h3>
              <p className="text-gray-600">
                Dapatkan link download setelah upload selesai. Salin dan bagikan dengan siapapun, tanpa perlu login.
              </p>
            </div>
            
            <div className="card card-hover p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-5">
                <svg 
                  className="w-7 h-7" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download Cepat</h3>
              <p className="text-gray-600">
                Pengalaman download yang lancar dengan informasi progress, kecepatan, dan estimasi waktu selesai.
              </p>
            </div>
          </div>
        </section> */}
        
        {/* How it works section */}
        {/* <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-3">Cara Kerja</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ShareFile dirancang untuk menyederhanakan proses berbagi file dengan tiga langkah mudah.
            </p>
          </div>
          
          <div className="relative"> */}
            {/* Connector line */}
            {/* <div className="hidden md:block absolute top-24 left-0 w-full border-t-2 border-dashed border-gray-200 -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 mb-4 font-bold text-xl shadow-md">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload File</h3>
                <p className="text-gray-600">
                  Drag & drop file anda ke area upload atau pilih file dari perangkat anda.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 mb-4 font-bold text-xl shadow-md">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Dapatkan Link</h3>
                <p className="text-gray-600">
                  Setelah upload selesai, salin link download yang dihasilkan secara otomatis.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 mb-4 font-bold text-xl shadow-md">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Bagikan</h3>
                <p className="text-gray-600">
                  Bagikan link tersebut dengan siapapun yang perlu mengakses file anda.
                </p>
              </div>
            </div>
          </div>
        </section> */}
        
        {/* Footer */}
        <footer className="pt-10 border-t border-gray-200 text-center text-gray-600">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">ShareFile</h3>
            <p className="text-sm">Berbagi file cepat dan mudah</p>
          </div>
          
          <p className="text-sm">
            © {new Date().getFullYear()} ShareFile. Semua hak cipta dilindungi.
          </p>
        </footer>
      </div>
    </main>
  )
}
