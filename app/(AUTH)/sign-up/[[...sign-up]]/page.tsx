"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutList,
  CheckSquare,
  Shield,
  Zap,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Google Sign Up
  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error(err);
      setError("Connection to Google failed. Please try again.");
    }
  };

  // 2. Email Sign Up
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.longMessage || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Verify Code
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: NEW "EXECUTION" BRANDING ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#080808] text-white px-16 py-12">
        {/* Different Background Pattern for Sign Up */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px]" />
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

        {/* Main Content: Focused on EXECUTION now, not just contracts */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-[4rem] font-black tracking-tighter leading-[0.95] uppercase italic mb-6">
            Contracts <br />
            Don't Fail. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Execution Does.
            </span>
          </h1>

          <p className="text-gray-400 text-lg font-medium max-w-md mb-12 leading-relaxed">
            Most disputes happen because execution drifts. Jifwa converts your
            contract into a live, trackable workspace.
          </p>

          {/* New Visuals: Showing "Milestones" instead of "Parsing" */}
          <div className="space-y-4">
            {/* Card 1: Milestone Active */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border-l-4 border-emerald-500 shadow-2xl w-full max-w-md">
              <div className="h-10 w-10 rounded-lg bg-emerald-900/20 flex items-center justify-center text-emerald-400">
                <LayoutList size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">
                    Milestone 1: Prototype
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Due in 2 days • $2,500 Escrow
                </div>
              </div>
            </div>

            {/* Card 2: Auto-Verification */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 w-full max-w-md ml-8 opacity-80">
              <div className="h-10 w-10 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400">
                <CheckSquare size={20} />
              </div>
              <div className="flex-1 text-sm font-medium text-gray-300">
                Deliverable Verified{" "}
                <span className="text-[10px] text-gray-500 ml-2 italic">
                  AUTO-MATCHED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="relative z-10 flex items-center gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <Shield size={14} /> End-to-End Encrypted
          </span>
          <span className="flex items-center gap-2">
            <Zap size={14} /> Private AI Core
          </span>
        </div>
      </div>

      {/* ================= RIGHT: SIGN UP FORM ================= */}
      <div className="flex flex-col min-h-screen bg-white px-6 py-6 lg:px-0 lg:py-0 lg:justify-center lg:items-center">
        {/* Mobile Header */}
        <div className="w-full flex justify-start lg:hidden mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> 
          </Link>
        </div>

        <div className="w-full max-w-[400px] mx-auto my-auto lg:mx-0 lg:my-0">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 flex items-center justify-center gap-2">
              {pendingVerification ? "Verify Email" : "Join"}
              {!pendingVerification && (
                <span className="font-black tracking-tighter text-black">
                  Jifwa<span className="text-indigo-600">.</span>
                </span>
              )}
            </h2>
            <p className="text-gray-500 text-sm">
              {pendingVerification
                ? `Enter the code sent to ${email}`
                : "Create your workspace. No credit card required."}
            </p>
          </div>

          {/* === VERIFICATION STATE === */}
          {pendingVerification ? (
            <form onSubmit={handleVerification} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-medium">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  6-Digit Code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg text-lg outline-none focus:bg-white focus:border-black focus:ring-0 transition-all placeholder:text-gray-300 text-gray-900 font-mono tracking-[0.5em] text-center"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-900 transition-all mt-4 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Verify & Enter{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* === SIGN UP STATE === */
            <>
              <button
                onClick={handleGoogleSignUp}
                className="w-full h-12 bg-white text-gray-700 font-bold text-sm border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 mb-6 shadow-sm group"
              >
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="G"
                  width={20}
                  height={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Sign up with Google
              </button>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs font-medium">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-400 text-gray-900"
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
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:bg-white focus:border-black transition-all placeholder:text-gray-400 text-gray-900 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-black text-white font-bold text-sm rounded-lg hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </>
          )}

          {/* Footer Links */}
          <div className="mt-8 text-center pb-6 lg:pb-0">
            <p className="text-sm text-gray-500 mb-6">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-indigo-600 font-bold hover:underline"
              >
                Log in
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
          </div>
        </div>
      </div>
    </div>
  );
}
