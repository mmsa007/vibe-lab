"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface VibeResult {
  type: string;
  analysis: string;
}

export default function SharePage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<VibeResult | null>(null);
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("vibeResult");
    const storedImage = localStorage.getItem("vibeImage");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { setResult(null); }
    }
    if (storedImage) setImage(storedImage);
  }, []);

  const handleSave = () => {
    alert('Please use browser screenshot to save image, or press Ctrl+P to print as PDF');
  };

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-pulse" style={{ fontSize: "12px", letterSpacing: "4px", color: "#999" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="share-page">
      <div className="share-actions">
        <button className="share-btn" onClick={() => router.push("/result")}>Back</button>
        <button className="share-btn-primary" onClick={handleSave}>Save Image</button>
      </div>

      <div className="share-card" ref={cardRef}>
        <div className="share-card-inner">
          <div className="share-brand">VIBE LAB</div>

          {image && (
            <div className="share-avatar">
              <img src={image} alt="user" />
            </div>
          )}

          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <div className="share-type-label">YOUR VIBE TYPE</div>
            <div className="share-type">{result.type}</div>
          </div>

          <div className="share-divider" />

          <div className="share-analysis">{result.analysis}</div>

          <div className="share-spacer" />

          <div className="share-footer">
            <div className="share-footer-divider" />
            <div className="share-footer-text">Scan to test your vibe</div>
            <div className="share-qr">QR</div>
          </div>
        </div>
      </div>

      <div className="share-hint">Save image and share to social media</div>
    </div>
  );
}
