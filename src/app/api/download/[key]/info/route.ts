import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const fileKey = params.key

    // Cari file berdasarkan key
    const file = await prisma.file.findUnique({
      where: {
        key: fileKey,
      },
    })

    if (!file) {
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
      originalName: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      createdAt: file.createdAt,
    })
  } catch (error) {
    console.error('Error fetching file info:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil informasi file' },
      { status: 500 }
    )
  }
} 