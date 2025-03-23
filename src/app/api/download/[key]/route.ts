import { NextRequest, NextResponse } from 'next/server'
import { supabase, generateUUID } from '@/app/lib/supabase'
import { readFile } from 'fs/promises'
import path from 'path'
import { headers } from 'next/headers'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const fileKey = params.key

    // Cari file berdasarkan key di Supabase
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('key', fileKey)
      .single()

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    // Untuk file yang tidak publik, disini bisa ditambahkan logic autentikasi

    try {
      // Baca file dari disk
      const fileData = await readFile(file.path)

      // Catat aktivitas download di Supabase
      const headersList = headers()
      const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

      const { error: statError } = await supabase
        .from('download_stats')
        .insert({
          id: generateUUID(),
          file_id: file.id,
          ip_address: ipAddress,
          completed: true,
          downloaded_at: new Date().toISOString()
        })

      if (statError) {
        console.error('Error recording download stats:', statError)
        // Lanjutkan meskipun gagal mencatat status download
      }

      // Kirim file sebagai respons
      const response = new NextResponse(fileData, {
        status: 200,
        headers: {
          'Content-Type': file.mime_type,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(file.original_name)}"`,
          'Content-Length': file.size.toString(),
        },
      })

      return response
    } catch (error) {
      console.error('Error reading file from disk:', error)
      return NextResponse.json(
        { error: 'File tidak dapat diakses' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error processing download:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses download' },
      { status: 500 }
    )
  }
} 