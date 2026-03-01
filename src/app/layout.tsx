import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dm-sans" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif" });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-ibm-plex-mono" });

export const metadata: Metadata = {
  title: "ThesisFlow",
  description: "Next-gen discovery for venture capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} font-sans antialiased text-primary selection:bg-accent-light selection:text-accent bg-page h-screen flex overflow-hidden`}>

        {/* Fixed Left Sidebar - 220px */}
        <div className="w-[220px] shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-page h-full">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-16">
            <div className="pl-[32px] pr-[32px] pt-[32px] pb-[32px] max-w-[1200px] w-full">
              {children}
            </div>
          </main>
        </div>

      </body>
    </html>
  );
}
