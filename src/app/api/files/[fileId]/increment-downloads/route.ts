import { NextRequest, NextResponse } from 'next/server'
import { supabase, generateUUID } from '@/app/lib/supabase'

// API route untuk menambah jumlah download file
export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId

    // Cari file berdasarkan ID di Supabase
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    // Catat aktivitas download di Supabase
    const { error: statsError } = await supabase
      .from('download_stats')
      .insert({
        id: generateUUID(),
        file_id: file.id,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        completed: true,
        downloaded_at: new Date().toISOString()
      })

    if (statsError) {
      console.error('Error recording download stats:', statsError)
      return NextResponse.json(
        { error: 'Terjadi kesalahan saat merekam download' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing download count:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah hitungan download' },
      { status: 500 }
    )
  }
} 