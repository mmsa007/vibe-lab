import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "氛围感研究所",
  description: "AI 分析你的氛围感与气质",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
