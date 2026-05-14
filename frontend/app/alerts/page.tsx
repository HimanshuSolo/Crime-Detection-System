"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AlertStats {
  consecutive_suspicious: number;
  recent_suspicious_count: number;
  total_suspicious: number;
  last_alert_time: number;
}

interface AlertConfig {
  email_enabled: boolean;
  sms_enabled: boolean;
  detection_threshold: number;
  consecutive_threshold: number;
  frequency_threshold: number;
  alert_cooldown: number;
}

export default function AlertsPage() {
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [config, setConfig] = useState<AlertConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [detectionThreshold, setDetectionThreshold] = useState(0.76);
  const [consecutiveThreshold, setConsecutiveThreshold] = useState(5);
  const [frequencyThreshold, setFrequencyThreshold] = useState(10);

  useEffect(() => {
    fetchAlertData();
    const interval = setInterval(fetchAlertData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlertData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/alerts/`);
      if (response.data.status === "ok") {
        setStats(response.data.tracker);
        setConfig(response.data.config);
        setEmailEnabled(response.data.config.email_enabled);
        setSmsEnabled(response.data.config.sms_enabled);
        setDetectionThreshold(response.data.config.detection_threshold);
        setConsecutiveThreshold(response.data.config.consecutive_threshold);
        setFrequencyThreshold(response.data.config.frequency_threshold);
      }
    } catch (error) {
      console.error("Failed to fetch alert data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");

    try {
      const response = await axios.put(`${BACKEND_URL}/api/alerts/`, {
        email_enabled: emailEnabled,
        sms_enabled: smsEnabled,
        detection_threshold: detectionThreshold,
        consecutive_threshold: consecutiveThreshold,
        frequency_threshold: frequencyThreshold,
      });

      if (response.data.status === "ok") {
        setMessage("Settings saved successfully!");
        fetchAlertData();
      }
    } catch (error) {
      setMessage("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <section className="section">
          <h2 className="section-title">Alert Settings</h2>
          <p>Loading...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <section className="section">
        <h2 className="section-title">Alert Settings</h2>

        {message && (
          <div
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              marginBottom: "20px",
              background: message.includes("success") ? "#d4edda" : "#f8d7da",
              color: message.includes("success") ? "#155724" : "#721c24",
            }}
          >
            {message}
          </div>
        )}

        <div className="grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "30px" }}>
          {/* Stats Panel */}
          <div className="card" style={{ background: "#f8f9ff", padding: "25px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ color: "#667eea", marginBottom: "20px" }}>Live Statistics</h3>

            {stats && (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <StatBox label="Consecutive Suspicious" value={stats.consecutive_suspicious} color="#ff6b6b" />
                <StatBox label="Recent Suspicious (window)" value={stats.recent_suspicious_count} color="#ffa726" />
                <StatBox label="Total Suspicious" value={stats.total_suspicious} color="#667eea" />
              </div>
            )}

            {stats && stats.last_alert_time > 0 && (
              <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
                Last alert: {new Date(stats.last_alert_time * 1000).toLocaleString()}
              </p>
            )}
          </div>

          {/* Settings Panel */}
          <div className="card" style={{ background: "#f8f9ff", padding: "25px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
            <h3 style={{ color: "#667eea", marginBottom: "20px" }}>Configuration</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontWeight: "500" }}>Email Alerts</label>
                <ToggleSwitch value={emailEnabled} onChange={setEmailEnabled} />
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontWeight: "500" }}>SMS Alerts (Twilio)</label>
                <ToggleSwitch value={smsEnabled} onChange={setSmsEnabled} />
              </div>

              <div>
                <label style={{ fontWeight: "500", display: "block", marginBottom: "8px" }}>
                  Detection Threshold
                </label>
                <input
                  type="number"
                  value={detectionThreshold}
                  onChange={(e) => setDetectionThreshold(parseFloat(e.target.value))}
                  min={0}
                  max={1}
                  step={0.01}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                />
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>
                  Confidence score threshold (0.0 - 1.0) for suspicious detection
                </p>
              </div>

              <div>
                <label style={{ fontWeight: "500", display: "block", marginBottom: "8px" }}>
                  Consecutive Threshold
                </label>
                <input
                  type="number"
                  value={consecutiveThreshold}
                  onChange={(e) => setConsecutiveThreshold(parseInt(e.target.value))}
                  min={1}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                />
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>
                  Number of consecutive suspicious detections to trigger an alert
                </p>
              </div>

              <div>
                <label style={{ fontWeight: "500", display: "block", marginBottom: "8px" }}>
                  Frequency Threshold
                </label>
                <input
                  type="number"
                  value={frequencyThreshold}
                  onChange={(e) => setFrequencyThreshold(parseInt(e.target.value))}
                  min={1}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                  }}
                />
                <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>
                  Number of suspicious detections in the time window to trigger an alert
                </p>
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="btn"
                style={{
                  marginTop: "10px",
                  background: saving ? "#ccc" : "#667eea",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: "600",
                }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div style={{ marginTop: "40px", background: "#fff3cd", padding: "20px", borderRadius: "8px", border: "1px solid #ffc107" }}>
          <h3 style={{ color: "#856404", marginBottom: "15px" }}>Setup Instructions</h3>
          <div style={{ color: "#856404", lineHeight: "1.8" }}>
            <p><strong>To enable Email Alerts:</strong></p>
            <ol style={{ marginLeft: "20px" }}>
              <li>Configure your email backend in <code>settings.py</code></li>
              <li>Set <code>ALERT_EMAIL</code> to your email address</li>
              <li>Or use environment variables for production</li>
            </ol>

            <p style={{ marginTop: "15px" }}><strong>To enable SMS Alerts (Twilio):</strong></p>
            <ol style={{ marginLeft: "20px" }}>
              <li>Sign up at <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea" }}>twilio.com</a></li>
              <li>Get your Account SID, Auth Token, and phone number</li>
              <li>Configure these in <code>settings.py</code> under <code>ALERT_CONFIG</code></li>
              <li>Set <code>ALERT_PHONE_NUMBER</code> to your phone number</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", background: "white", borderRadius: "8px" }}>
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ fontSize: "1.5rem", fontWeight: "bold", color }}>{value}</span>
    </div>
  );
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: "50px",
        height: "26px",
        borderRadius: "13px",
        background: value ? "#667eea" : "#ccc",
        position: "relative",
        cursor: "pointer",
        transition: "background 0.3s",
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "2px",
          left: value ? "26px" : "2px",
          transition: "left 0.3s",
        }}
      />
    </div>
  );
}
