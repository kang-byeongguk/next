import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./ui/header/nav-bar";
import { inter } from "./ui/fonts";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "NextCart",
  description: "Shopping mall portfolio, built with Next.js App Router.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. 서버에서 세션 가져오기
  const session = await auth();

  // 2. 테마 초기화 스크립트 (FOUC 방지용)
  // 브라우저가 렌더링하기 전에 실행되어 깜빡임을 막습니다.
  const themeInitializerScript = `
    (function() {
      try {
        var localTheme = localStorage.getItem('theme');
        // 'forest' 테마가 저장되어 있으면 즉시 적용, 아니면 light 적용
        if (localTheme === 'forest') {
          document.documentElement.setAttribute('data-theme', 'forest');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      } catch (e) {}
    })();
  `;

  return (
    // suppressHydrationWarning: 스크립트로 인해 HTML 속성이 변경되므로 경고 무시 필요
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeInitializerScript,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          <div className="flex flex-col bg-base-100">
            <div className="w-full">
              <Navbar />
            </div>
            <div className="grow">{children}</div>
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}