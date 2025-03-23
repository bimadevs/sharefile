import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// API route untuk menambah jumlah download file
export async function POST(
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

    // Catat aktivitas download
    await prisma.downloadStats.create({
      data: {
        fileId: file.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        completed: true,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error incrementing download count:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah hitungan download' },
      { status: 500 }
    )
  }
} 