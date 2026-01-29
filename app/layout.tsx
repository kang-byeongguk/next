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

  return (
    <html lang="en">
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