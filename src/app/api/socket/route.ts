import { NextResponse } from 'next/server'
import { Server } from 'socket.io'
import type { Socket as TSocket } from 'socket.io'

// Menyimpan informasi socket untuk setiap pengguna yang sedang melakukan transfer
interface ConnectedSocket {
  userId?: string
  fileId?: string
  fileKey?: string
}

// Global state untuk socket
let io: Server | null = null
const connectedSockets = new Map<string, ConnectedSocket>()

// Handler untuk Socket.IO
export function GET() {
  // Jika server sudah terinisialisasi, kirim response ok
  if (io) {
    return new NextResponse('Socket is already running.', {
      status: 200,
    })
  }

  try {
    // Inisialisasi Socket.IO server
    io = new Server({
      path: '/api/socket',
      addTrailingSlash: false,
    })

    // Handle connections
    io.on('connection', (socket: TSocket) => {
      console.log('Client connected:', socket.id)
      
      // Simpan informasi socket
      connectedSockets.set(socket.id, {})

      // Handle start download request
      socket.on('startDownload', ({ fileKey }) => {
        if (fileKey) {
          // Update socket info dengan fileKey yang sedang didownload
          connectedSockets.set(socket.id, { 
            ...connectedSockets.get(socket.id),
            fileKey 
          })
        }
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        connectedSockets.delete(socket.id)
      })
    })

    console.log('Socket.IO server initialized')
    return new NextResponse('Socket server started.', {
      status: 200,
    })
  } catch (error) {
    console.error('Error initializing Socket.IO server:', error)
    return new NextResponse('Failed to start socket server.', {
      status: 500,
    })
  }
}

// Fungsi untuk mengirim update progress upload ke client
export function emitUploadProgress(
  fileKey: string, 
  data: { 
    progress: number
    uploaded: number
    fileSize: number
    speed: number
    eta: number
  }
) {
  if (!io) return

  // Emit ke semua client yang terhubung
  io.emit('uploadProgress', data)
}

// Fungsi untuk mengirim notifikasi upload selesai
export function emitUploadComplete(fileKey: string) {
  if (!io) return
  io.emit('uploadComplete', { key: fileKey })
}

// Fungsi untuk mengirim update progress download ke client
export function emitDownloadProgress(
  fileKey: string,
  data: {
    progress: number
    downloaded: number
    fileSize: number
    speed: number
    eta: number
  }
) {
  if (!io) return

  // Cari semua socket yang sedang mendownload file ini
  for (const [socketId, socketInfo] of connectedSockets.entries()) {
    if (socketInfo.fileKey === fileKey) {
      io.to(socketId).emit('downloadProgress', data)
    }
  }
}

// Fungsi untuk mengirim notifikasi download selesai
export function emitDownloadComplete(fileKey: string) {
  if (!io) return

  // Cari semua socket yang sedang mendownload file ini
  for (const [socketId, socketInfo] of connectedSockets.entries()) {
    if (socketInfo.fileKey === fileKey) {
      io.to(socketId).emit('downloadComplete')
    }
  }
} 