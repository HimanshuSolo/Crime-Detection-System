"use client";

import { useState } from "react";

export default function LiveStream() {
  const [ipUrl, setIpUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const startStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipUrl) return;

    // Use URL encoding for the ipUrl
    const encodedUrl = encodeURIComponent(ipUrl);
    const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    setStreamUrl(`${backendBaseUrl}/getipstream?url=${encodedUrl}`);
    setIsPlaying(true);
  };

  const stopStream = () => {
    setStreamUrl("");
    setIsPlaying(false);
  };

  return (
    <main
      style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1 className="text-3xl font-bold mb-6">Live Camera Feed</h1>
      <p className="mb-6 text-gray-400">
        Connect your phone using an IP Webcam app (e.g., "IP Webcam" on Android or "EpocCam" on iOS). Provide the URL below (e.g., http://192.168.1.5:8080/video).
      </p>

      <form onSubmit={startStream} className="flex gap-4 mb-8">
        <input
          type="text"
          value={ipUrl}
          onChange={(e) => setIpUrl(e.target.value)}
          placeholder="http://192.168.x.x:8080/video"
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition"
        >
          {isPlaying ? "Update Stream" : "Connect"}
        </button>
        {isPlaying && (
          <button
            type="button"
            onClick={stopStream}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium transition"
          >
            Stop
          </button>
        )}
      </form>

      <div className="bg-gray-900 aspect-video rounded-xl border border-gray-800 flex items-center justify-center overflow-hidden relative">
        {streamUrl ? (
          <img
            src={streamUrl}
            alt="Live Stream"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-500 flex flex-col items-center">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p>Enter an IP camera URL to start streaming</p>
          </div>
        )}
      </div>
    </main>
  );
}
