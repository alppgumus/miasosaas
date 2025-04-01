"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/login") || pathname.includes("/register");

  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {!isAuthPage && <Navbar />}
          <main className={!isAuthPage ? "pl-64" : ""}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
