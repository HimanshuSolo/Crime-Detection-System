"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <div className="container">
      <section className="section">
        <h2 className="section-title">Welcome to Crime Detection System</h2>
        <div className="home-content">
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "20px",
            }}
          >
            This advanced system uses artificial intelligence and deep learning
            to analyze videos and detect suspicious activities or criminal
            behavior in real-time.
          </p>

          <div
            className="grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <div
              className="feature-card"
              style={{
                background: "#f8f9ff",
                padding: "20px",
                borderRadius: "8px",
                borderLeft: "4px solid #667eea",
              }}
            >
              <h3 style={{ color: "#667eea", marginBottom: "10px" }}>
                📹 Video Analysis
              </h3>
              <p>
                Upload videos to analyze for suspicious activities and get
                real-time predictions.
              </p>
              <Link
                href="/analyze"
                className="btn"
                style={{ marginTop: "15px", display: "inline-block" }}
              >
                Analyze Video
              </Link>
            </div>

            <div
              className="feature-card"
              style={{
                background: "#f8f9ff",
                padding: "20px",
                borderRadius: "8px",
                borderLeft: "4px solid #764ba2",
              }}
            >
              <h3 style={{ color: "#764ba2", marginBottom: "10px" }}>
                🎥 Live Stream
              </h3>
              <p>
                Monitor live video streams with real-time crime detection and
                alerts.
              </p>
              <Link
                href="/stream"
                className="btn"
                style={{ marginTop: "15px", display: "inline-block" }}
              >
                View Stream
              </Link>
            </div>

            <div
              className="feature-card"
              style={{
                background: "#f8f9ff",
                padding: "20px",
                borderRadius: "8px",
                borderLeft: "4px solid #667eea",
              }}
            >
              <h3 style={{ color: "#667eea", marginBottom: "10px" }}>
                📊 Analytics
              </h3>
              <p>
                View detailed reports and analytics of detected activities over
                time.
              </p>
              <Link
                href="#"
                className="btn"
                style={{ marginTop: "15px", display: "inline-block" }}
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
