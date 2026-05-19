\"use client\";

import { useEffect, useState } from \"react\";
import { useRouter } from \"next/navigation\";

interface VibeResult {
  type: string;
  analysis: string;
  styles: { name: string; description?: string }[];
  hairstyle: { recommendation: string; avoid?: string }[];
  eyebrow: { recommendation: string; avoid?: string }[];
  glasses: { recommendation: string; avoid?: string }[];
  keywords: string[];
}

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<VibeResult | null>(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vibeResult");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.type) {
          setResult(parsed);
        } else {
          setNoData(true);
        }
      } catch {
        setNoData(true);
      }
    } else {
      setNoData(true);
    }
  }, []);

  if (noData) {
    return (
      <div className="home-page">
        <p style={{ fontSize: "14px", color: "#999", marginBottom: "24px", textAlign: "center" }}>
          暂无分析结果
        </p>
        <button
          onClick={() => router.push("/")}
          style={{ fontSize: "12px", letterSpacing: "2px", padding: "12px 32px", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer" }}
        >
          重新上传
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-pulse" style={{ fontSize: "12px", letterSpacing: "4px", color: "#999" }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-nav">
        <button className="result-nav-btn" onClick={() => router.push("/")}>
          重新分析
        </button>
        <button className="result-nav-btn-primary" onClick={() => router.push("/share")}>
          分享
        </button>
      </div>

      <div className="result-container">
        <div className="result-header">
          <div className="result-label">你的气质类型</div>
          <div className="result-type">{result.type}</div>
        </div>

        <div className="result-divider" />

        <div className="result-section">
          <div className="section-title">气质分析</div>
          <div className="section-content">{result.analysis}</div>
        </div>

        {result.styles && result.styles.length > 0 && (
          <div className="result-section">
            <div className="section-title">适合路线</div>
            <div className="keywords-wrap">
              {result.styles.map((style, i) => (
                <span className="keyword-tag" key={i}>{typeof style === 'string' ? style : style.name}</span>
              ))}
            </div>
          </div>
        )}

        {result.hairstyle && result.hairstyle.length > 0 && (
          <div className="result-section">
            <div className="section-title">发型建议</div>
            <ul className="section-list">
              {result.hairstyle.map((item, i) => (
                <li key={i}>
                  {typeof item === 'string' ? item : item.recommendation}
                  {typeof item === 'object' && item.avoid && (
                    <>（避免：<strong>{item.avoid}</strong>）</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.eyebrow && result.eyebrow.length > 0 && (
          <div className="result-section">
            <div className="section-title">眉毛建议</div>
            <ul className="section-list">
              {result.eyebrow.map((item, i) => (
                <li key={i}>
                  {typeof item === 'string' ? item : item.recommendation}
                  {typeof item === 'object' && item.avoid && (
                    <>（避免：<strong>{item.avoid}</strong>）</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.glasses && result.glasses.length > 0 && (
          <div className="result-section">
            <div className="section-title">镜框建议</div>
            <ul className="section-list">
              {result.glasses.map((item, i) => (
                <li key={i}>
                  {typeof item === 'string' ? item : item.recommendation}
                  {typeof item === 'object' && item.avoid && (
                    <>（避免：<strong>{item.avoid}</strong>）</>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.keywords && result.keywords.length > 0 && (
          <div className="result-section">
            <div className="section-title">氛围关键词</div>
            <div className="keywords-wrap">
              {result.keywords.map((keyword, i) => (
                <span className="keyword-tag" key={i}>{keyword}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="result-bottom-btn">
        <button onClick={() => router.push("/share")}>生成分享卡片</button>
      </div>
    </div>
  );
}
