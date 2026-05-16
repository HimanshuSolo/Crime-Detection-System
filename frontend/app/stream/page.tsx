"use client";

import { useEffect, useState } from "react";

type LatestStatus = {
  label: string;
  score: number | null;
  updated_at: number;
};

export default function Stream() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "square">("landscape");
  const [latestStatus, setLatestStatus] = useState<LatestStatus>({
    label: "NORMAL",
    score: null,
    updated_at: 0,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let active = true;

    const loadLatestStatus = async () => {
      try {
        const response = await fetch("/api/alerts/");
        if (!response.ok) return;
        const data = await response.json();
        if (active && data.latest_status) {
          setLatestStatus(data.latest_status);
        }
      } catch {
        return;
      }
    };

    loadLatestStatus();
    const loadingTimer = window.setTimeout(() => {
      if (active) {
        setLoading(false);
      }
    }, 1500);
    const timer = window.setInterval(loadLatestStatus, 2000);
    return () => {
      active = false;
      window.clearTimeout(loadingTimer);
      window.clearInterval(timer);
    };
  }, []);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.naturalWidth < image.naturalHeight) {
      setOrientation("portrait");
    } else if (image.naturalWidth === image.naturalHeight) {
      setOrientation("square");
    } else {
      setOrientation("landscape");
    }
    setLoading(false);
  };

  const stageStyle = {
    width: "100%",
    maxWidth: orientation === "portrait" ? "460px" : orientation === "square" ? "760px" : "1120px",
    height: orientation === "portrait" ? "min(78vh, 760px)" : orientation === "square" ? "min(74vh, 760px)" : "min(70vh, 620px)",
  } as const;

  return (
    <div className="container">
      <div className="section">
        <h2
          className="section-title"
          style={{
            fontSize: "2.2rem",
            marginBottom: "30px",
            color: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          🎥 Live Stream
        </h2>

        <div
          style={{
            marginBottom: "25px",
            padding: "18px 22px",
            background: "#e8f4f8",
            borderRadius: "10px",
            borderLeft: "5px solid #00a8cc",
            lineHeight: "1.6",
            boxShadow: "0 2px 8px rgba(0, 168, 204, 0.1)",
          }}
        >
          <p
            style={{
              color: "#333",
              fontSize: "1.1rem",
              margin: "0",
              fontWeight: "500",
            }}
          >
            Watch live video stream with real-time crime detection analysis.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "18px 20px",
              background: "#ffe6e6",
              borderRadius: "10px",
              borderLeft: "5px solid #e74c3c",
              marginBottom: "25px",
              color: "#c0392b",
              fontSize: "1rem",
              fontWeight: "500",
            }}
          >
            <strong> Error:</strong> {error}
          </div>
        )}

        <div
          className="video-container"
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "12px",
            marginBottom: "25px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            borderRadius: "10px",
            overflow: "hidden",
            border: "2px solid #e0e0e0",
            background: "#000",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
                textAlign: "center",
                width: "100%",
              }}
            >
              <div className="spinner" style={{ marginBottom: "12px" }}></div>
              <p
                style={{
                  marginTop: "0",
                  color: "#667eea",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                Loading stream...
              </p>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 12,
              padding: "6px 10px",
              borderRadius: "999px",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#fff",
              background: latestStatus.label === "SUSPICIOUS" ? "rgba(220, 38, 38, 0.92)" : "rgba(22, 163, 74, 0.92)",
              border: "1px solid rgba(255,255,255,0.24)",
              boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
              pointerEvents: "none",
            }}
          >
            {latestStatus.label}
          </div>
          <div style={stageStyle}>
            <img
              src={`${apiUrl}/getstream/`}
              alt="Live Stream"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "contain",
                background: "#000",
                borderRadius: "8px",
              }}
              onError={() => setError("Failed to load stream")}
              onLoad={handleImageLoad}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            background: "#f0f7ff",
            borderRadius: "10px",
            borderLeft: "5px solid #667eea",
            boxShadow: "0 2px 8px rgba(102, 126, 234, 0.15)",
          }}
        >
          <h3
            style={{
              color: "#667eea",
              marginBottom: "18px",
              fontSize: "1.3rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📊 Real-Time Analysis
          </h3>
          <ul style={{ paddingLeft: "25px", margin: "0", lineHeight: "1.8" }}>
            <li
              style={{ marginBottom: "8px", color: "#333", fontSize: "1rem" }}
            >
              Continuous video monitoring
            </li>
            <li
              style={{ marginBottom: "8px", color: "#333", fontSize: "1rem" }}
            >
              Frame-by-frame analysis
            </li>
            <li
              style={{ marginBottom: "8px", color: "#333", fontSize: "1rem" }}
            >
              Instant alerts on suspicious activity
            </li>
            <li style={{ color: "#333", fontSize: "1rem" }}>
              Live confidence scores
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
