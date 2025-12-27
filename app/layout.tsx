import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/* =========================
  Metadata
========================= */

export const metadata: Metadata = {
  title: {
    default: "Jifwa | The AI Contract Execution Platform",
    template: "%s | Jifwa",
  },
  description:
    "Convert signed contracts into clear, trackable execution workflows. Jifwa uses private, self-hosted AI to ensure what is agreed actually gets delivered.",
  keywords: [
    "Contract Execution",
    "AI Contract Analysis",
    "LegalTech",
    "SaaS",
    "Dispute Resolution",
    "Project Management",
  ],
  authors: [{ name: "Jifwa Team" }],
  creator: "Jifwa",
  publisher: "Conseccomms Private Limited",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jifwa.com",
    title: "Contracts Don't Fail. Execution Does.",
    description:
      "Jifwa is an execution clarity layer. We turn PDFs into live checklists with End-to-End Encryption and No Third-Party AI.",
    siteName: "Jifwa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jifwa | The AI Contract Execution Platform",
    description: "Turn contracts into actionable milestones instantly.",
    creator: "@jifwa",
  },
};

/* =========================
  Viewport
========================= */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

/* =========================
  Root Layout
========================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
          <main>{children}</main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
