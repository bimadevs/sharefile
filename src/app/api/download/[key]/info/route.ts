import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const fileKey = params.key

    // Cari file berdasarkan key di Supabase
    const { data: file, error } = await supabase
      .from('files')
      .select('*')
      .eq('key', fileKey)
      .single()

    if (error || !file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    // Untuk file yang tidak publik, disini bisa ditambahkan logic autentikasi

    // Kirim informasi file
    return NextResponse.json({
      id: file.id,
      name: file.name,
      originalName: file.original_name,
      size: file.size,
      mimeType: file.mime_type,
      createdAt: file.created_at,
    })
  } catch (error) {
    console.error('Error fetching file info:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil informasi file' },
      { status: 500 }
    )
  }
} 