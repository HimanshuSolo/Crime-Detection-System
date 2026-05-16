'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type LatestStatus = {
  label: string
  score: number | null
  updated_at: number
}

export default function StreamToken() {
  const params = useParams()
  const token = params?.token as string
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'square'>('landscape')
  const [latestStatus, setLatestStatus] = useState<LatestStatus>({
    label: 'NORMAL',
    score: null,
    updated_at: 0,
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    let active = true

    const loadLatestStatus = async () => {
      try {
        const response = await fetch('/api/alerts/')
        if (!response.ok) return
        const data = await response.json()
        if (active && data.latest_status) {
          setLatestStatus(data.latest_status)
        }
      } catch {
        return
      }
    }

    loadLatestStatus()
    const loadingTimer = window.setTimeout(() => {
      if (active) {
        setLoading(false)
      }
    }, 1500)
    const timer = window.setInterval(loadLatestStatus, 2000)
    return () => {
      active = false
      window.clearTimeout(loadingTimer)
      window.clearInterval(timer)
    }
  }, [])

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget
    if (image.naturalWidth < image.naturalHeight) {
      setOrientation('portrait')
    } else if (image.naturalWidth === image.naturalHeight) {
      setOrientation('square')
    } else {
      setOrientation('landscape')
    }
    setLoading(false)
  }

  const stageStyle = {
    width: '100%',
    maxWidth: orientation === 'portrait' ? '460px' : orientation === 'square' ? '760px' : '1120px',
    height: orientation === 'portrait' ? 'min(78vh, 760px)' : orientation === 'square' ? 'min(74vh, 760px)' : 'min(70vh, 620px)',
  } as const

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

        <div className="video-container" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', marginBottom: '25px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', borderRadius: '10px', overflow: 'hidden', border: '2px solid #e0e0e0', background: '#000' }}>
          {loading && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', width: '100%' }}>
              <div className="spinner" style={{ marginBottom: '12px' }}></div>
              <p style={{ marginTop: '0', color: '#667eea', fontSize: '1.1rem', fontWeight: '500' }}>Loading stream...</p>
            </div>
          )}
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 12, padding: '6px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: '#fff', background: latestStatus.label === 'SUSPICIOUS' ? 'rgba(220, 38, 38, 0.92)' : 'rgba(22, 163, 74, 0.92)', border: '1px solid rgba(255,255,255,0.24)', boxShadow: '0 8px 18px rgba(0,0,0,0.25)', pointerEvents: 'none' }}>
            {latestStatus.label}
          </div>
          <div style={stageStyle}>
            <img
              src={`${apiUrl}/gettokenstream/${token}/`}
              alt={`Stream ${token}`}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                background: '#000',
                borderRadius: '8px',
              }}
              onError={() => setError('Failed to load stream')}
              onLoad={handleImageLoad}
            />
          </div>
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
