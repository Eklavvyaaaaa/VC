import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { RightPanel } from "@/components/RightPanel";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "VC Intelligence",
  description: "Next-gen discovery for venture capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-white overflow-hidden`}>
        <div className="flex h-screen overflow-hidden">
          {/* Column 1: Workspace Sidebar */}
          <Sidebar />

          {/* Column 2: Content Hub */}
          <div className="relative flex flex-1 flex-col overflow-y-auto no-scrollbar bg-white">
            <Header />
            <main className="flex-1 px-10 py-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>

          {/* Column 3: Context Panel */}
          <RightPanel />
        </div>
      </body>
    </html>
  );
}
