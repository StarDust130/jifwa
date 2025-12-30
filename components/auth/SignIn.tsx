"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Server,
  Loader2,
  AlertCircle,
  Lock,
  ListTodo,
} from "lucide-react";

// --- BRAND CONFIGURATION ---
// Primary: #0B2447 (Navy)
// Accent: #14B8A6 (Teal)

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIC ADDED: Check for error flags or SSO redirects ---
  useEffect(() => {
    const errorType = searchParams.get("error");
    const redirectUrl = searchParams.get("redirect_url");

    // Case 1: Manual Email Redirect (error=exists)
    // Case 2: Google SSO Bounce (redirect_url contains sso-callback)
    if (
      errorType === "exists" ||
      (redirectUrl && redirectUrl.includes("sso-callback"))
    ) {
      setError("Account already exists. Please log in.");

      // Clean URL after 4 seconds
      const timer = setTimeout(() => {
        setError("");
        // We use window.history to clean the URL without triggering a full router refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  // ------------------------

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error(err);
      setError("Connection to Google failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Two-factor authentication is required.");
      }
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: BRANDING & VALUE PROP ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#0B2447] text-white px-16 py-12 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#14B8A6]/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        {/* Navigation */}
        <div className="relative z-10 w-full">
          <Link
            href="/"
            className="group flex items-center gap-3 text-xs font-bold text-slate-400 hover:text-white transition-colors w-fit uppercase tracking-wider"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </Link>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 my-auto">
          {/* HEADLINE */}
          <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Turn Contracts Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-teal-200">
              Predictable Execution.
            </span>
          </h1>

          {/* SUBHEAD */}
          <p className="text-lg text-slate-300 max-w-lg mb-12 leading-relaxed font-medium">
            Jifwa converts signed contracts into clear, trackable workflows so
            what's agreed actually gets delivered. No assumptions. No scattered
            emails.
          </p>

          {/* VISUAL METAPHOR: The Process (Contract -> AI -> Milestones) */}
          <div className="relative w-full max-w-md">
            {/* Card 1: The Input (Contract) */}
            <div className="absolute top-0 left-0 z-10 w-full transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-200">
                    Service_Agreement_Signed.pdf
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Uploaded 2 mins ago
                  </div>
                </div>
                <div className="text-[10px] text-[#14B8A6] font-bold uppercase tracking-wider animate-pulse">
                  Extracting...
                </div>
              </div>
            </div>

            {/* Card 2: The Output (Execution) */}
            <div className="relative z-20 mt-16 ml-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex flex-col p-5 rounded-xl bg-[#0F2E5A] border border-[#14B8A6]/30 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                    <ListTodo size={18} />
                  </div>
                  <div className="text-sm font-bold text-white">
                    Generated Milestones
                  </div>
                </div>
                {/* Milestone Items */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-4 h-4 rounded-full border border-[#14B8A6] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#14B8A6] rounded-full"></div>
                    </div>
                    <span>Phase 1 Deliverables (Due: Dec 30)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 opacity-60">
                    <div className="w-4 h-4 rounded-full border border-slate-500"></div>
                    <span>Payment Tranche #1 Release</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="relative z-10 grid grid-cols-2 gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-white/5 pt-8">
          <div className="flex items-center gap-3">
            <Lock size={14} className="text-[#14B8A6]" />
            <div>
              <span className="block text-slate-300">End-to-End Encrypted</span>
              <span className="block text-[9px] mt-0.5 opacity-60">
                AES-256 / TLS 1.3
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Server size={14} className="text-[#14B8A6]" />
            <div>
              <span className="block text-slate-300">Private AI Engine</span>
              <span className="block text-[9px] mt-0.5 opacity-60">
                No 3rd Party APIs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT: AUTH FORM ================= */}
      <div className="flex flex-col min-h-screen bg-white px-6 py-6 lg:justify-center lg:items-center">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#0B2447] font-bold"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        <div className="w-full max-w-[380px] mx-auto lg:mx-0">
          {/* CENTERED HEADER */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-[#0B2447] tracking-tight mb-2">
              Welcome Back!
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Enter your credentials to access your workspace.
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-11 bg-white text-slate-700 font-bold text-sm border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 mb-6 group disabled:opacity-70"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-slate-400" />
            ) : (
              <>
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                Sign in with Google
              </>
            )}
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-slate-300 text-[10px] font-extrabold uppercase tracking-widest">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-600 text-xs font-bold">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B2447]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10 transition-all text-[#0B2447] font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0B2447]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10 transition-all text-[#0B2447] font-medium placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0B2447] text-white font-bold text-sm rounded-lg hover:bg-[#15345A] transition-all shadow-lg shadow-blue-900/10 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-[#14B8A6]" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-[#14B8A6] font-bold hover:text-[#0B2447] transition-colors"
              >
                Sign up
              </Link>
            </p>

            <div className="flex justify-center gap-4 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Link
                href="/terms"
                target="_blank"
                className="hover:text-[#0B2447] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                target="_blank"
                className="hover:text-[#0B2447] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="mailto:support@jifwa.com"
                target="_blank"
                className="hover:text-[#0B2447] transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
