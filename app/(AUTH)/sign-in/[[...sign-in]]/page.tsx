"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AuthPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Google Login Handler
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error(err);
      setError("Connection to Google failed. Please try again.");
    }
  };

  // 2. Email/Password Login Handler
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
        console.log("MFA or further steps needed", result);
      }
    } catch (err: any) {
      console.error("Error:", err.errors[0].longMessage);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: BRANDING (DESKTOP ONLY) ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#030303] text-white px-16 py-12">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a2a2a_1px,transparent_1px),linear-gradient(to_bottom,#2a2a2a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors group w-fit"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-[4rem] font-black tracking-tighter leading-[0.95] uppercase italic mb-6">
            Contracts, <br />
            Turned Into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE]">
              Clear Actions.
            </span>
          </h1>

          <p className="text-gray-400 text-lg font-medium max-w-md mb-12 leading-relaxed">
            Stop reading. Start executing. Jifwa instantly syncs your legal
            obligations to your daily workflow.
          </p>

          <div className="space-y-4">
            {/* Card 1: Parsing */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/10 shadow-xl w-full max-w-md">
              <div className="h-10 w-10 rounded-lg bg-[#252525] flex items-center justify-center text-indigo-400">
                <FileText size={20} />
              </div>
              <div className="flex-1 text-sm font-medium text-gray-300">
                MSA_Global_v2.pdf{" "}
                <span className="text-[10px] text-gray-500 ml-2 italic tracking-wider animate-pulse">
                  PARSING...
                </span>
              </div>
            </div>

            {/* Card 2: Jira Ticket */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-indigo-500/30 shadow-xl shadow-indigo-900/10 w-full max-w-md ml-8">
              <div className="h-10 w-10 rounded-lg bg-green-900/20 flex items-center justify-center text-green-500 ring-1 ring-green-500/20">
                <CheckCircle2 size={20} />
              </div>
              <div className="flex-1 text-sm font-bold text-white">
                Created Jifwa Milestone
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} /> SOC2 Type II
            </span>
            <span className="flex items-center gap-2">
              <Globe size={14} /> Global Compliance
            </span>
          </div>
          <p>AUTH_KERNEL_V4.0</p>
        </div>
      </div>

      {/* ================= RIGHT: AUTH FORM ================= */}
      <div className="flex flex-col min-h-screen bg-white px-6 py-6 lg:px-0 lg:py-0 lg:justify-center lg:items-center">
        {/* Mobile Header: Static Layout (Pushes form down, doesn't float) */}
        <div className="w-full flex justify-start lg:hidden mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Main Form Container: Centered vertically on mobile using my-auto */}
        <div className="w-full max-w-[400px] mx-auto my-auto lg:mx-0 lg:my-0">
          {/* Header with Cool Text Logo */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 flex items-center justify-center gap-2">
              Sign in to
              <span className="font-black tracking-tighter text-black">
                Jifwa<span className="text-indigo-600">.</span>
              </span>
            </h2>
            <p className="text-gray-500 text-sm">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full h-12 bg-white text-gray-700 font-bold text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm group"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="G"
              width={20}
              height={20}
              className="group-hover:scale-110 transition-transform"
            />
            Continue with Google
          </button>

          {/* OR Divider */}
          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase">
              OR
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-medium">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-gray-400 transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-gray-400 transition-all placeholder:text-gray-400 text-gray-900 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a1a1a] text-white font-bold text-sm rounded-lg hover:bg-black transition-all shadow-lg shadow-gray-200 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center pb-6 lg:pb-0">
            <p className="text-sm text-gray-500 mb-6">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign up
              </Link>
            </p>

            <div className="flex justify-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <Link
                href="/terms"
                className="hover:text-gray-600 transition-colors"
              >
                Terms
              </Link>
              <span className="text-gray-200">•</span>
              <Link
                href="/privacy"
                className="hover:text-gray-600 transition-colors"
              >
                Privacy
              </Link>
            </div>

            <div className="mt-8">
              <Link
                href="mailto:support@jifwa.com"
                className="text-[10px] font-bold text-gray-300 hover:text-gray-500 uppercase tracking-widest transition-colors"
              >
                Need Help? Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
