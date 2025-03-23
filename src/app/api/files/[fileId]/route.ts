import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// API route untuk mendapatkan informasi file berdasarkan ID file
export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId

    // Cari file berdasarkan ID
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    // Kirim informasi file
    return NextResponse.json({
      file: {
        id: file.id,
        name: file.originalName,
        size: file.size,
        key: file.key,
        mimeType: file.mimeType,
        createdAt: file.createdAt,
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