import { v4 as uuidv4 } from 'uuid'

/**
 * Menghasilkan string unik untuk key file
 */
export function generateUniqueKey(): string {
  return uuidv4()
}

/**
 * Memformat ukuran file dari bytes menjadi format yang mudah dibaca (KB, MB, GB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Memformat kecepatan transfer menjadi format yang mudah dibaca
 */
export function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond === 0) return '0 B/s'
  
  const k = 1024
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
  
  return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Memformat estimasi waktu yang tersisa
 */
export function formatETA(seconds: number): string {
  if (!seconds || !isFinite(seconds) || seconds < 0) {
    return 'Menghitung...'
  }
  
  if (seconds < 60) {
    return `${Math.ceil(seconds)} detik`
  } else if (seconds < 3600) {
    return `${Math.ceil(seconds / 60)} menit`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.ceil((seconds % 3600) / 60)
    return `${hours} jam ${minutes} menit`
  }
}

/**
 * Membuat slug dari nama file yang aman untuk URL
 */
export function createSafeFileName(originalName: string): string {
  // Hapus ekstensi
  const lastDotIndex = originalName.lastIndexOf('.')
  const nameWithoutExt = lastDotIndex !== -1 
    ? originalName.slice(0, lastDotIndex) 
    : originalName
  
  // Ubah ke slug
  const slug = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  // Tambahkan ekstensi kembali
  const extension = lastDotIndex !== -1 
    ? originalName.slice(lastDotIndex) 
    : ''
  
  return `${slug}${extension}`
} 