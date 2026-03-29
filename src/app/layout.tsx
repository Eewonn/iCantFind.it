import type { Metadata } from "next";
import { JetBrains_Mono, VT323, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Nav from "@/components/nav";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "iCantFind.it",
  description: "a ctf notebook & cheatsheet for people who definitely found the flag",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${vt323.variable} ${ibmPlexSans.variable} dark`}
    >
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <Nav />
          <main className="flex-1 md:ml-56 pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
