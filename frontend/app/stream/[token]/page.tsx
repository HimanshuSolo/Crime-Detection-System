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
        <h2 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '30px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>📹 Stream Analysis</h2>

        <div style={{ marginBottom: '25px', padding: '20px 22px', background: '#e7f3ff', borderRadius: '10px', borderLeft: '5px solid #2196F3', boxShadow: '0 2px 8px rgba(33, 150, 243, 0.15)' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: '600', color: '#1565c0', letterSpacing: '0.3px' }}
          >
            🔑 <strong>Stream Token:</strong>
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#0d47a1', fontFamily: 'monospace', background: '#fff', padding: '10px 12px', borderRadius: '5px', wordBreak: 'break-all', fontWeight: '500' }}>
            {token}
          </p>
          <p style={{ marginTop: '12px', color: '#444', fontSize: '1rem', lineHeight: '1.5' }}>
            This is a specific analysis stream for the uploaded video.
          </p>
        </div>

        {error && (
          <div style={{ padding: '18px 20px', background: '#ffe6e6', borderRadius: '10px', borderLeft: '5px solid #e74c3c', marginBottom: '25px', color: '#c0392b', fontSize: '1rem', fontWeight: '500' }}>
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <div className="video-container" style={{ position: 'relative', width: '100%', marginBottom: '25px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '10px', overflow: 'hidden', border: '2px solid #e0e0e0', background: '#000' }}>
          {loading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '100%' }}>
              <div className="spinner" style={{ marginBottom: '12px' }}></div>
              <p style={{ marginTop: '0', color: '#667eea', fontSize: '1.1rem', fontWeight: '500' }}>Loading stream...</p>
            </div>
          )}
          <img
            src={`${apiUrl}/gettokenstream/${token}/`}
            alt={`Stream ${token}`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              minHeight: '400px',
            }}
            onError={() => setError('Failed to load stream')}
            onLoad={() => setLoading(false)}
          />
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
          <a href="/analyze" className="btn" style={{ padding: '14px 28px', fontSize: '1.05rem', fontWeight: '6 00', flex: 1, textAlign: 'center', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ease' }}>
            ← Back to Analysis
          </a>
        </div>
      </div>
    </div>
  )
}
