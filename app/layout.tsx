import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import {GeistMono} from "geist/font/mono";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/elements/theme-provider";

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
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} h-full font-sans antialiased bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <div className="text-xl font-bold tracking-tight text-slate-900">
                  Jifwa
                </div>

                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
                        Sign In
                      </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <button className="h-9 rounded-md bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>

                  <SignedIn>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-9 w-9",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </header>

            <main className="min-h-screen pt-20">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
