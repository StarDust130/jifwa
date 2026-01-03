"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Check,
  Globe,
  Lock,
  LayoutDashboard,
  FileCheck,
  Users,
} from "lucide-react";

// --- BRAND COLORS ---
// Navy: #0B2447
// Teal: #14B8A6

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();

  // --- FORM STATE ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  // --- UX STATES ---
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [highlightTerms, setHighlightTerms] = useState(false);

  // --- LOADING CHECK ---
  // If Clerk is still loading, or if user is signed in (redirecting), show Loading UI
  const isPageLoading =
    !isLoaded || !isUserLoaded || (isUserLoaded && isSignedIn);

  useEffect(() => {
    if (isUserLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isUserLoaded, isSignedIn, router]);

  const isAnyLoading = loading || googleLoading || isPageLoading;

  // --- LOGIC ---
  const toggleTerms = () => {
    if (loading || googleLoading) return;
    setTermsAccepted((prev) => {
      const newState = !prev;
      if (newState && error.includes("Terms")) {
        setError("");
        setHighlightTerms(false);
      }
      return newState;
    });
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;
    if (!termsAccepted) {
      setError("Please agree to the Terms & Privacy Policy.");
      setHighlightTerms(true);
      setTimeout(() => setHighlightTerms(false), 1500);
      return;
    }
    setGoogleLoading(true);
    setError("");
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error(err);
      setError("Connection failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!termsAccepted) {
      setError("Please agree to the Terms & Privacy Policy.");
      setHighlightTerms(true);
      setTimeout(() => setHighlightTerms(false), 1500);
      return;
    }
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

      // --- LOGIC ADDED HERE: Redirect if account exists ---
    if (err.errors?.[0]?.code === "form_identifier_exists") {
      // Use window.location to force a hard redirect, bypassing Next.js router quirks
      window.location.href = "/sign-in?error=exists";
      return;
    }
    // ----------------------

    setError(err.errors?.[0]?.longMessage || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="md:min-h-screen w-full   grid lg:grid-cols-2 font-sans bg-white overflow-hidden">
      {/* ================= LEFT: BRANDING PANEL ================= */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[#0B2447] text-white px-16 py-12 overflow-hidden">
        {/* Background Gradients */}
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
            Manage Execution, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-teal-200">
              Not Just Contracts.
            </span>
          </h1>

          {/* SUBHEAD */}
          <p className="text-lg text-slate-300 max-w-lg mb-12 leading-relaxed font-medium">
            Join the alignment layer that ensures delivery happens exactly as
            agreed. Clear, secure, and transparent.
          </p>

          {/* VISUAL METAPHOR: Collaboration & Security */}
          <div className="relative w-full max-w-md">
            {/* Card 1: Vendor Invite */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl mb-4 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                <Users size={20} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-200">
                  Invite Vendor
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Collab on milestones securely
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center text-[#0B2447]">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2: Security */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-200">
                  Bank-Grade Security
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  AES-256 Encryption & Private AI
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <div className="relative z-10 flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-t border-white/5 pt-8">
          <span className="flex items-center gap-2">
            <Globe size={14} className="text-[#14B8A6]" /> For Agencies
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-2">
            <FileCheck size={14} className="text-[#14B8A6]" /> For Freelancers
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-2">
            <LayoutDashboard size={14} className="text-[#14B8A6]" /> For SMEs
          </span>
        </div>
      </div>

      {/* ================= RIGHT: AUTH FORM OR LOADING ================= */}
      <div className="flex flex-col  md:min-h-screen bg-white relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-6">
          <Link
            href="/"
            className="p-2 bg-slate-50 rounded-full text-[#0B2447] hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 xl:px-24">
          {/* --- COOL LOADING STATE --- */}
          {isPageLoading ? (
            <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#14B8A6] opacity-20 animate-ping"></div>
                <div className="relative w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                  <Lock className="text-[#0B2447]" size={28} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0B2447]">
                  Securing Workspace
                </h3>
                <p className="text-slate-400 text-sm font-medium">
                  Initializing encrypted session...
                </p>
              </div>
              <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#14B8A6] w-1/2 animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          ) : (
            /* --- MAIN FORM --- */
            <div className="w-full max-w-md mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* HEADING */}
              <div className="mb-8 text-center w-full">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B2447] tracking-tight mb-3">
                  {pendingVerification ? "Check your inbox" : "Get started"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {pendingVerification
                    ? `We sent a code to ${email}`
                    : "Create your workspace. No credit card required."}
                </p>
              </div>

              {/* ERROR ALERT */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* VERIFICATION FORM */}
              {pendingVerification ? (
                <form
                  onSubmit={handleVerification}
                  className="w-full space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#0B2447] uppercase tracking-wide ml-1">
                      Verification Code
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      disabled={loading}
                      className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-3xl text-center font-mono tracking-[0.5em] outline-none focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10 transition-all placeholder:text-slate-300 text-[#0B2447] disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#0B2447] text-white font-bold text-sm rounded-xl hover:bg-[#15345A] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2
                        size={20}
                        className="animate-spin text-[#14B8A6]"
                      />
                    ) : (
                      <>
                        Verify <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <div className="w-full">
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={isAnyLoading}
                    className="w-full h-12 bg-white text-slate-700 font-bold text-sm border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 mb-8 shadow-sm active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {googleLoading ? (
                      <Loader2
                        size={20}
                        className="animate-spin text-slate-400"
                      />
                    ) : (
                      <>
                        <Image
                          src="https://www.svgrepo.com/show/475656/google-color.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="group-hover:scale-110 transition-transform"
                        />
                        Continue with Google
                      </>
                    )}
                  </button>

                  <div className="relative flex py-2 items-center mb-8">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">
                      OR REGISTER WITH EMAIL
                    </span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B2447] ml-1">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        disabled={isAnyLoading}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10 transition-all placeholder:text-slate-400 text-[#0B2447] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0B2447] ml-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        disabled={isAnyLoading}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10 transition-all placeholder:text-slate-400 text-[#0B2447] font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* CHECKBOX (Blinks on Error) */}
                    <motion.div
                      animate={highlightTerms ? { x: [-5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className={`pt-2 pb-2 px-3 rounded-lg transition-colors duration-300 ${
                        highlightTerms
                          ? "bg-rose-50 border border-rose-200"
                          : "bg-transparent border border-transparent"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-3 group select-none transition-opacity ${
                          isAnyLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={toggleTerms}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-md border transition-all flex items-center justify-center mt-0.5 ${
                            termsAccepted
                              ? "bg-[#0B2447] border-[#0B2447] text-white"
                              : highlightTerms
                              ? "bg-white border-rose-500 animate-pulse"
                              : "bg-white border-slate-300 group-hover:border-[#0B2447]"
                          }`}
                        >
                          {termsAccepted && <Check size={12} strokeWidth={4} />}
                        </div>
                        <p
                          className={`text-xs leading-relaxed font-medium transition-colors ${
                            highlightTerms ? "text-rose-600" : "text-slate-500"
                          }`}
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            target="_blank"
                            className="text-[#0B2447] font-bold hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Terms
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            target="_blank"
                            className="text-[#0B2447] font-bold hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                    </motion.div>

                    <button
                      type="submit"
                      disabled={isAnyLoading}
                      className="w-full h-12 bg-[#0B2447] text-white font-bold text-sm rounded-xl hover:bg-[#15345A] transition-all shadow-lg shadow-blue-900/10 mt-2 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-[#14B8A6]"
                        />
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-[#14B8A6] font-bold hover:text-[#0B2447] transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
