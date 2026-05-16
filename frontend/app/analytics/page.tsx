"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AlertTracker = {
  consecutive_suspicious: number;
  recent_suspicious_count: number;
  total_suspicious: number;
  last_alert_time: number;
};

type AlertConfig = {
  email_enabled: boolean;
  sms_enabled: boolean;
  detection_threshold: number;
  consecutive_threshold: number;
  frequency_threshold: number;
  alert_cooldown: number;
};

type AlertPayload = {
  status: string;
  tracker: AlertTracker;
  config: AlertConfig;
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
};

function formatTime(value: number) {
  if (!value) return "No alerts yet";
  return new Date(value * 1000).toLocaleString();
}

export default function AnalyticsPage() {
  const [payload, setPayload] = useState<AlertPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadAnalytics = async () => {
    try {
      setError("");
      const response = await fetch("/api/alerts/");
      if (!response.ok) {
        throw new Error(`Failed to load analytics (${response.status})`);
      }

      const data = (await response.json()) as AlertPayload;
      setPayload(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    const timer = window.setInterval(loadAnalytics, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const readinessScore = useMemo(() => {
    if (!payload) return 0;
    const enabledScore = Number(payload.config.sms_enabled) + Number(payload.config.email_enabled);
    const historyScore = Math.min(payload.tracker.total_suspicious, 20) / 20;
    return Math.round(((enabledScore / 2) * 0.45 + historyScore * 0.55) * 100);
  }, [payload]);

  const metrics: MetricCard[] = payload
    ? [
        {
          label: "Suspicious Frames",
          value: String(payload.tracker.total_suspicious),
          hint: "All detections recorded since the tracker started",
        },
        {
          label: "Current Streak",
          value: String(payload.tracker.consecutive_suspicious),
          hint: `Needs ${payload.config.consecutive_threshold} to trigger an alert`,
        },
        {
          label: "Recent Window",
          value: String(payload.tracker.recent_suspicious_count),
          hint: `Compared with threshold ${payload.config.frequency_threshold}`,
        },
        {
          label: "Readiness",
          value: `${readinessScore}%`,
          hint: "Based on alert settings and detection activity",
        },
      ]
    : [];

  const recentSignals = payload
    ? [
        {
          label: "SMS alerts",
          status: payload.config.sms_enabled ? "Enabled" : "Disabled",
          tone: payload.config.sms_enabled ? "good" : "neutral",
        },
        {
          label: "Email alerts",
          status: payload.config.email_enabled ? "Enabled" : "Disabled",
          tone: payload.config.email_enabled ? "good" : "neutral",
        },
        {
          label: "Detection threshold",
          status: payload.config.detection_threshold.toFixed(2),
          tone: "info",
        },
        {
          label: "Last alert",
          status: formatTime(payload.tracker.last_alert_time),
          tone: "info",
        },
      ]
    : [];

  const readinessBarStyle = {
    width: `${Math.max(18, readinessScore)}%`,
  };

  return (
    <div className="container">
      <section
        className="section"
        style={{
          background: "linear-gradient(145deg, #08111f 0%, #101f3a 48%, #1c2f57 100%)",
          color: "#f6f8ff",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(3, 8, 20, 0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "18px",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <div>
            <p style={{ letterSpacing: "0.18em", textTransform: "uppercase", color: "#88a4ff", marginBottom: "10px", fontSize: "0.78rem" }}>
              Live analytics
            </p>
            <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.05 }}>
              Latest crime detection intelligence
            </h2>
            <p style={{ maxWidth: "680px", color: "rgba(246,248,255,0.78)", marginTop: "14px", lineHeight: 1.7 }}>
              A live snapshot of the alert tracker, detection thresholds, and system readiness pulled directly from the backend.
            </p>
          </div>

          <div
            style={{
              minWidth: "220px",
              padding: "16px 18px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginBottom: "8px" }}>Refresh status</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700 }}>{loading ? "Loading..." : error ? "Attention needed" : "Live"}</div>
            <div style={{ marginTop: "8px", color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>
              Updated {lastUpdated || "just now"}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "22px",
              padding: "16px 18px",
              borderRadius: "14px",
              background: "rgba(255, 113, 113, 0.12)",
              border: "1px solid rgba(255, 113, 113, 0.2)",
              color: "#ffd0d0",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "26px",
          }}
        >
          {(loading ? Array.from({ length: 4 }) : metrics).map((metric, index) => (
            <div
              key={loading ? `placeholder-${index}` : metric.label}
              style={{
                padding: "20px",
                borderRadius: "18px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                minHeight: "150px",
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: "70%", height: "14px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", marginBottom: "18px" }} />
                  <div style={{ width: "40%", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.12)", marginBottom: "16px" }} />
                  <div style={{ width: "88%", height: "12px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }} />
                </>
              ) : (
                <>
                  <p style={{ margin: 0, color: "#9fb3ff", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {metric.label}
                  </p>
                  <div style={{ marginTop: "14px", fontSize: "2.4rem", fontWeight: 800, color: "#ffffff" }}>{metric.value}</div>
                  <p style={{ marginTop: "10px", color: "rgba(246,248,255,0.7)", lineHeight: 1.6 }}>{metric.hint}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "1.2rem" }}>System readiness</h3>
            <div style={{ height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "14px" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: "999px",
                  background: "linear-gradient(90deg, #7c9cff 0%, #5ef0c2 100%)",
                  transition: "width 0.35s ease",
                  ...readinessBarStyle,
                }}
              />
            </div>
            <p style={{ color: "rgba(246,248,255,0.72)", lineHeight: 1.7, margin: 0 }}>
              The tracker is {payload ? `${payload.config.sms_enabled ? "SMS-enabled" : "SMS-disabled"} and ${payload.config.email_enabled ? "email-enabled" : "email-disabled"}` : "loading live state"}.
            </p>
          </div>

          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px", fontSize: "1.2rem" }}>Alert signals</h3>
            <div style={{ display: "grid", gap: "12px" }}>
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div key={`skeleton-${index}`} style={{ height: "54px", borderRadius: "14px", background: "rgba(255,255,255,0.08)" }} />
                  ))
                : recentSignals.map((signal) => (
                    <div
                      key={signal.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "12px",
                        padding: "14px 16px",
                        borderRadius: "14px",
                        background: "rgba(10, 18, 34, 0.4)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div>
                        <div style={{ color: "#f6f8ff", fontWeight: 600 }}>{signal.label}</div>
                        <div style={{ color: "rgba(246,248,255,0.62)", fontSize: "0.88rem", marginTop: "4px" }}>
                          {signal.tone === "good" ? "Connected and ready" : signal.tone === "neutral" ? "Waiting for manual activation" : "Derived from live backend settings"}
                        </div>
                      </div>
                      <div
                        style={{
                          color: signal.tone === "good" ? "#75f0c5" : signal.tone === "neutral" ? "#d9e1ff" : "#9fb3ff",
                          fontWeight: 700,
                          textAlign: "right",
                        }}
                      >
                        {signal.status}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/analyze" className="btn" style={{ textDecoration: "none" }}>
            New analysis
          </Link>
          <Link href="/stream" className="btn btn-secondary" style={{ textDecoration: "none" }}>
            Open live stream
          </Link>
        </div>
      </section>
    </div>
  );
}