'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, FileText, X, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: any = null

// Initialize PDF.js only on client side
const initializePdfJs = async () => {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    try {
      pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
    } catch (error) {
      console.error('Failed to load PDF.js:', error)
    }
  }
}

interface ResumeUploadProps {
  value: string
  onChange: (content: string) => void
}

export function ResumeUpload({ value, onChange }: ResumeUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isTextMode, setIsTextMode] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isPdfJsReady, setIsPdfJsReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize PDF.js on component mount
  useEffect(() => {
    initializePdfJs().then(() => {
      setIsPdfJsReady(true)
    })
  }, [])

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    if (!isPdfJsReady || !pdfjsLib) {
      toast.error('PDF processing is still loading. Please try again in a moment.')
      return
    }

    setUploadedFile(file)
    toast.success('Resume uploaded successfully!')

    // Extract text from PDF using client-side PDF.js
    try {
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
      const pdf = await loadingTask.promise

      let fullText = ''

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Combine text items from the page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')

        fullText += pageText + '\n'
      }

      // Clean up the extracted text
      let text = fullText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .trim()

      if (!text || text.length < 10) {
        throw new Error('Could not extract readable text from PDF')
      }

      onChange(text)
      setShowPreview(true)
      toast.success('Text extracted from PDF successfully!')
    } catch (error) {
      console.error('PDF extraction error:', error)
      toast.error('Failed to extract text from PDF. Please try again or use text mode.')
      setUploadedFile(null)
    }
  }

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Remove uploaded file
  const removeFile = () => {
    setUploadedFile(null)
    setShowPreview(false)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Switch to text mode
  const switchToTextMode = () => {
    setIsTextMode(true)
    setUploadedFile(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Switch to upload mode
  const switchToUploadMode = () => {
    setIsTextMode(false)
    onChange('')
  }

  if (isTextMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="h-4 w-4" />
            <span>Text Mode</span>
          </div>
          <button
            onClick={switchToUploadMode}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Switch to PDF Upload
          </button>
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your resume content here (text format)..."
          rows={18}
          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white shadow-sm text-gray-900 placeholder-gray-500"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <>
          {/* Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your resume here or click to browse
                </h3>
                <p className="text-gray-600 text-sm">
                  Supports PDF files up to 10MB
                </p>
              </div>
              <button
                className={`px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${!isPdfJsReady ? 'opacity-75 cursor-wait' : ''}`}
                disabled={!isPdfJsReady}
              >
                {isPdfJsReady ? 'Choose PDF File' : 'Loading PDF Reader...'}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {/* Switch to Text Mode */}
          <div className="text-center">
            <button
              onClick={switchToTextMode}
              className="text-sm text-gray-600 hover:text-gray-700 underline"
            >
              Or paste resume as text instead
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Uploaded File Display */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{uploadedFile.name}</h4>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  title={showPreview ? 'Hide preview' : 'Show preview'}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  onClick={removeFile}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Preview */}
          {showPreview && value && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 text-sm">Extracted Text Preview</h4>
                <span className="text-xs text-gray-500">{value.length} characters</span>
              </div>
              <div className="max-h-48 overflow-y-auto bg-white rounded-lg p-3 border border-gray-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {value.substring(0, 1000)}{value.length > 1000 ? '...' : ''}
                </pre>
              </div>
            </div>
          )}

          {/* Switch to Text Mode */}
          <div className="text-center">
            <button
              onClick={switchToTextMode}
              className="text-sm text-gray-600 hover:text-gray-700 underline"
            >
              Switch to text mode for manual editing
            </button>
          </div>
        </>
      )}
    </div>
  )
}
