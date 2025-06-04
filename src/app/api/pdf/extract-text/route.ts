import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // For now, return a success response indicating the file was received
    // The actual PDF parsing will be done on the client side
    return NextResponse.json({
      success: true,
      message: 'PDF file received. Text extraction will be handled on the client side.',
      filename: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('PDF upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF file. Please try again or use text mode.' },
      { status: 500 }
    )
  }
}
