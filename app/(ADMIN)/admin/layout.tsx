import { ReactNode } from "react";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminUser();
  return children;
}
