"use client";

import { useState, useEffect } from "react";

export default function Stream() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    setLoading(false);
  }, []);

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
          <img
            src={`${apiUrl}/getstream/`}
            alt="Live Stream"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              minHeight: "400px",
            }}
            onError={() => setError("Failed to load stream")}
            onLoad={() => setLoading(false)}
          />
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
