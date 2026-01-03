import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

function getAllowedAdmins(): string[] {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = getAllowedAdmins();
  if (!allowed.length) return false;
  return allowed.includes(email.toLowerCase());
}

export async function requireAdminUser() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!user || !isAdminEmail(email)) {
    redirect("/dashboard");
  }

  return user;
}

export async function assertAdminApi() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!user || !isAdminEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
