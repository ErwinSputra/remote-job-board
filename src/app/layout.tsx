import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RemoteJobs — Find the Best Remote Jobs",
    template: "%s • RemoteJobs",
  },
  description:
    "Browse hundreds of remote job opportunities across software engineering, design, marketing, and more. Find your next remote role today.",
  keywords: [
    "remote jobs",
    "work from home",
    "remote work",
    "job board",
    "freelance",
    "online jobs",
  ],
  authors: [{ name: "RemoteJobs" }],
  metadataBase: new URL("https://yourdomain.com"), // 🔁 replace with your actual domain
  openGraph: {
    title: "RemoteJobs — Find the Best Remote Jobs",
    description:
      "Browse hundreds of remote job opportunities across software engineering, design, marketing, and more.",
    url: "https://yourdomain.com", // 🔁 replace with your actual domain
    siteName: "RemoteJobs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoteJobs — Find the Best Remote Jobs",
    description:
      "Browse hundreds of remote job opportunities across software engineering, design, marketing, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
