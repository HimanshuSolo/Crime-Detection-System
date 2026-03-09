'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')

  // Always call the Next.js proxy endpoint (same origin) to avoid CORS errors.
  const apiUrl = ''

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
      setError('')
      setPrediction(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile)
      setFileName(droppedFile.name)
      setError('')
      setPrediction(null)
    } else {
      setError('Please drop a video file')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a video file')
      return
    }

    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const formData = new FormData()
      formData.append('vid', file)

      // Upload to Django backend
      const response = await axios.post(
        `/api`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data) {
        setToken(response.data.token || '')
        setPrediction(response.data)
        setFile(null)
        setFileName('')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze video. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="section">
        <h2 className="section-title">Analyze Video</h2>

        <form onSubmit={handleSubmit}>
          <div className="upload-area" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📹</div>
              <h3>Upload or Drag Video Here</h3>
              <p style={{ color: '#666', marginTop: '10px' }}>
                Drag and drop a video file or clicking to browse
              </p>
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              id="video-input"
              style={{ display: 'none' }}
            />
            <label
              htmlFor="video-input"
              className="btn"
              style={{ cursor: 'pointer' }}
            >
              Browse Files
            </label>
          </div>

          {fileName && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#d4edda', borderRadius: '4px', borderLeft: '4px solid #28a745' }}>
              <strong>Selected File:</strong> {fileName}
            </div>
          )}

          {error && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '4px', borderLeft: '4px solid #dc3545' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || !file}
              style={{ padding: '15px 40px', fontSize: '1.1rem' }}
            >
              {loading ? 'Analyzing...' : 'Analyze Video'}
            </button>
          </div>
        </form>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '20px', color: '#667eea' }}>
              Processing video... This may take a few moments.
            </p>
          </div>
        )}

        {prediction && (
          <div className="result-section success" style={{ marginTop: '40px' }}>
            <h3 style={{ marginBottom: '15px', color: '#155724' }}>✓ Analysis Complete</h3>
            <div className="result-content">
              <p><strong>Token:</strong> {token}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '4px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(prediction, null, 2)}
                </pre>
              </div>
              {token && (
                <div style={{ marginTop: '20px' }}>
                  <p><strong>View Stream:</strong></p>
                  <a href={`/stream/${token}`} className="btn btn-secondary">
                    View Stream with Token
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
