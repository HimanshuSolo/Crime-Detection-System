'use client'

import { useState, useEffect } from 'react'

export default function Stream() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <div className="container">
      <div className="section">
        <h2 className="section-title">Live Stream</h2>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '1.05rem' }}>
            Watch live video stream with real-time crime detection analysis.
          </p>
        </div>

        {error && (
          <div style={{ padding: '15px', background: '#f8d7da', borderRadius: '4px', borderLeft: '4px solid #dc3545', marginBottom: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="video-container">
          <img
            src={`${apiUrl}/getstream/`}
            alt="Live Stream"
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

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9ff', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
          <h3 style={{ color: '#667eea', marginBottom: '10px' }}>Real-Time Analysis</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Continuous video monitoring</li>
            <li>Frame-by-frame analysis</li>
            <li>Instant alerts on suspicious activity</li>
            <li>Live confidence scores</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
