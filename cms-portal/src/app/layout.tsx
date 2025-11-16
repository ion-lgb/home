import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guobin Li · Creative Technologist",
  description: "个人品牌站 + 管理后台"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="min-h-screen bg-[#f5f5f7] text-black">{children}</body>
    </html>
  );
}
