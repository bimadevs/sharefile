import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { readFile } from 'fs/promises'
import path from 'path'
import { headers } from 'next/headers'

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

    try {
      // Baca file dari disk
      const fileData = await readFile(file.path)

      // Catat aktivitas download
      const headersList = headers()
      const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

      await prisma.downloadStats.create({
        data: {
          fileId: file.id,
          ipAddress: ipAddress,
          completed: true,
        },
      })

      // Kirim file sebagai respons
      const response = new NextResponse(fileData, {
        status: 200,
        headers: {
          'Content-Type': file.mimeType,
          'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
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