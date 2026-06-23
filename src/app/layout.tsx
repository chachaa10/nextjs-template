import { Geist_Mono, IBM_Plex_Sans, Oxanium } from "next/font/google";

import { ThemeProvider } from "@/core/providers/theme-provider";
import { Navbar } from "@/features/auth/components/navbar";
import { cn } from "@/lib/utils";
import "./globals.css";

const oxaniumHeading = Oxanium({
  subsets: ["latin"],
  variable: "--font-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        ibmPlexSans.variable,
        oxaniumHeading.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
