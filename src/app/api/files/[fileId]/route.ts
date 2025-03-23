import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

// API route untuk mendapatkan informasi file berdasarkan ID file
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId

    // Cari file berdasarkan ID di Supabase
    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (error || !file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    // Kirim informasi file
    return NextResponse.json({
      file: {
        id: file.id,
        name: file.original_name,
        size: file.size,
        key: file.key,
        mimeType: file.mime_type,
        createdAt: file.created_at,
      }
    })
  } catch (error) {
    console.error('Error fetching file info:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil informasi file' },
      { status: 500 }
    )
  }
} 