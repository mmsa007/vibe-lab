"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyzeImage = async (base64: string) => {
    setIsAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setIsAnalyzing(false);
        return;
      }
      
      localStorage.setItem("vibeResult", JSON.stringify(data));
      localStorage.setItem("vibeImage", base64);
      router.push("/result");
    } catch (err) {
      setError("Analysis failed, please try again");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-logo">VIBE LAB</div>
      <h1 className="home-title">Some People Are Born With Vibe</h1>
      <p className="home-subtitle">Upload a photo, AI decodes your aura</p>
      
      {error && (
        <div style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "20px", textAlign: "center", maxWidth: "320px" }}>
          {error}
        </div>
      )}
      
      <div
        className="upload-area"
        onClick={() => fileInputRef.current?.click()}
      >
        {isAnalyzing ? (
          <div className="loading-pulse" style={{ fontSize: "12px", letterSpacing: "4px", color: "#999" }}>
            Analyzing your vibe...
          </div>
        ) : (
          <>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            <span className="upload-text">Upload Photo</span>
            <span className="upload-hint">Selfie / Half-body / Front face</span>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
        }}
      />
    </div>
  );
}
