'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function StreamToken() {
  const params = useParams()
  const token = params?.token as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="container">
      <div className="section">
        <h2 className="section-title">Stream Analysis</h2>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '4px', borderLeft: '4px solid #2196F3' }}>
          <p><strong>Stream Token:</strong> {token}</p>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '0.95rem' }}>
            This is a specific analysis stream for the uploaded video.
          </p>
        </div>

        {error && (
          <div style={{ padding: '15px', background: '#f8d7da', borderRadius: '4px', borderLeft: '4px solid #dc3545', marginBottom: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="video-container">
          <img
            src={`${apiUrl}/gettokenstream/${token}/`}
            alt={`Stream ${token}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={() => setError('Failed to load stream')}
            onLoad={() => setLoading(false)}
          />
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '10px', color: '#667eea' }}>Loading stream...</p>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <a href="/analyze" className="btn">
            Back to Analysis
          </a>
        </div>
      </div>
    </div>
  )
}
