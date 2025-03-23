import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { generateUniqueKey, createSafeFileName } from '@/app/lib/utils'
import { writeFile } from 'fs/promises'
import { mkdir } from 'fs/promises'
import path from 'path'

// Direktori untuk menyimpan file
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

export async function POST(request: NextRequest) {
  try {
    // Pastikan direktori upload ada
    try {
      await mkdir(UPLOAD_DIR, { recursive: true })
    } catch (error) {
      console.error('Error creating upload directory:', error)
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 400 }
      )
    }

    // Validasi ukuran file (100MB max)
    const MAX_SIZE = 100 * 1024 * 1024 // 100MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimum 100MB' },
        { status: 400 }
      )
    }

    // Generate unique file key untuk URL
    const fileKey = generateUniqueKey()
    
    // Buat nama file yang aman untuk penyimpanan
    const safeFileName = createSafeFileName(file.name)
    const fileName = `${Date.now()}-${safeFileName}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Konversi File ke ArrayBuffer dan simpan ke disk
    const buffer = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(buffer))

    // Simpan informasi file ke database
    const savedFile = await prisma.file.create({
      data: {
        name: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: filePath,
        key: fileKey,
        isPublic: true, // Default public
      },
    })

    // Kirim respons berhasil
    return NextResponse.json({
      id: savedFile.id,
      key: savedFile.key,
      name: savedFile.originalName,
      size: savedFile.size,
      createdAt: savedFile.createdAt,
    })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses file' },
      { status: 500 }
    )
  }
} 