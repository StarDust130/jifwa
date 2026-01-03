"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert, LogOut, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default function BannedPage() {
  const router = useRouter();
  const [isBanned, setIsBanned] = useState<boolean | null>(null);

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  useEffect(() => {
    let mounted = true;

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/user/status", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        if (!mounted) return;

        const banned = data?.isBanned === true;
        setIsBanned(banned);

        if (!banned) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Status check failed", error);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 2000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [router]);

  if (isBanned === false) return null;

  const isChecking = isBanned === null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50 text-slate-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl shadow-indigo-100 p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 font-semibold">
              Access blocked
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Your account is banned
            </h1>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Your account is currently restricted. Please contact the admin team to
          review your status. If this is unexpected, reach out and include your
          registered email.
        </p>

        {isChecking && (
          <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            Rechecking your status…
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="mailto:support@jifwa.com?subject=Account%20Reactivation%20Request"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-500 transition"
          >
            <Mail size={18} /> Email support
          </Link>

          <SignOutButton>
            <button className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition">
              <LogOut size={18} /> Logout
            </button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}
