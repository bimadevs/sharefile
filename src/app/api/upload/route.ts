import { NextRequest, NextResponse } from 'next/server'
import { supabase, generateUUID } from '@/app/lib/supabase'
import { createSafeFileName } from '@/app/lib/utils'
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
    const fileKey = generateUUID()
    
    // Buat nama file yang aman untuk penyimpanan
    const safeFileName = createSafeFileName(file.name)
    const fileName = `${Date.now()}-${safeFileName}`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Konversi File ke ArrayBuffer dan simpan ke disk
    const buffer = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(buffer))

    // Simpan informasi file ke Supabase
    const timestamp = new Date().toISOString()
    const { data: savedFile, error } = await supabase
      .from('files')
      .insert({
        id: generateUUID(),
        name: fileName,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        path: filePath,
        key: fileKey,
        is_public: true, // Default public
        created_at: timestamp,
        updated_at: timestamp
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving file to Supabase:', error)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat menyimpan data file' },
        { status: 500 }
      )
    }

    // Kirim respons berhasil
    return NextResponse.json({
      id: savedFile.id,
      key: savedFile.key,
      name: savedFile.original_name,
      size: savedFile.size,
      createdAt: savedFile.created_at,
    })
  } catch (error) {
    console.error('Error processing upload:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses file' },
      { status: 500 }
    )
  }
} 