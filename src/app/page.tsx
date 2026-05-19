\"use client\";

import { useState, useRef, useCallback } from \"react\";
import { useRouter } from \"next/navigation\";

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
      setError("分析失败，请重试");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-logo">氛围感研究所</div>
      <h1 className="home-title">有些人，天生自带氛围感</h1>
      <p className="home-subtitle">上传照片，AI 解读你的气质密码</p>
      
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
            正在分析你的气质...
          </div>
        ) : (
          <>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            <span className="upload-text">上传照片</span>
            <span className="upload-hint">支持自拍 / 半身照 / 正脸</span>
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
