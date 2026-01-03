"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import { Project } from "@/models/Project";
import User from "@/models/User";

// 👇 1. Define the Strict Type (Must match Client Component)
export type ProjectStatus =
  | "active"
  | "completed"
  | "archived"
  | "processing"
  | "pending"
  | "in_review"
  | "changes_requested";

export interface SerializedProject {
  _id: string;
  contractName: string;
  status: ProjectStatus; // 👈 Enforced Type
  createdAt: string;
  vendorEmail?: string;
  totalValue?: number;
  progress: number;
  clientName?: string;
  nextDeadline?: string;
  isUrgent: boolean;
}

export interface DashboardData {
  role: "client" | "vendor";
  user: {
    name: string;
    email: string;
    photo: string;
  };
  isAdmin: boolean;
  isBanned: boolean;
  stats: {
    totalProjects: number;
    activeCount: number;
    completedCount: number;
    pendingCount: number;
    totalValue: number;
  };
  projects: SerializedProject[];
}

const mapStatusBucket = (doc: any) => {
  const raw = (doc.status || "active").toLowerCase();
  const milestones = doc.milestones || [];
  const allApproved =
    milestones.length > 0 &&
    milestones.every((m: any) => m.status === "approved");
  const anyInReview = milestones.some((m: any) => m.status === "in_review");
  const anyChanges = milestones.some((m: any) =>
    ["changes_requested", "dispute"].includes(m.status)
  );

  if (allApproved || ["completed", "approved", "done"].includes(raw)) {
    return "completed" as ProjectStatus;
  }
  if (anyInReview || raw === "in_review" || raw === "processing") {
    return "in_review" as ProjectStatus;
  }
  if (anyChanges || raw === "changes_requested") {
    return "changes_requested" as ProjectStatus;
  }
  return "active" as ProjectStatus;
};

export async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) return null;

    await connectDB();

    // 1. Get User Role
    const dbUser = await User.findOne({ clerkId: userId });

    // Handle edge case where user is created in Clerk but not DB yet
    if (!dbUser) {
      return {
        role: "client",
        user: { name: "", email: "", photo: "" },
        isAdmin: false,
        isBanned: false,
        stats: {
          totalProjects: 0,
          activeCount: 0,
          pendingCount: 0,
          totalValue: 0,
        },
        projects: [],
      };
    }

    const role = dbUser.currentRole;
    const email = clerkUser.emailAddresses[0].emailAddress;

    // 2. Query Projects
    let query = {};
    if (role === "client") {
      query = { userId: userId };
    } else {
      query = {
        $or: [{ vendorId: userId }, { vendorEmail: email }],
      };
    }

    const projectsDocs = await Project.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // 3. Process Data
    let totalValue = 0;
    let pendingCount = 0;

    // Fetch Client Names for Vendors
    const clientIds =
      role === "vendor" ? projectsDocs.map((p) => p.userId) : [];
    const clients =
      role === "vendor"
        ? await User.find({ clerkId: { $in: clientIds } }).lean()
        : [];
    const clientMap = new Map(
      clients.map((c) => [c.clerkId, c.name || c.email])
    );

    const serializedProjects: SerializedProject[] = projectsDocs.map(
      (doc: any) => {
        const status = mapStatusBucket(doc);

        // Metrics
        const totalMilestones = doc.milestones?.length || 0;
        const completedMilestones =
          doc.milestones?.filter((m: any) => m.status === "approved").length ||
          0;
        const progress =
          totalMilestones > 0
            ? Math.round((completedMilestones / totalMilestones) * 100)
            : 0;

        const val = parseFloat(doc.total_value || "0");
        if (!isNaN(val)) totalValue += val;

        // Pending/Urgency Logic
        const hasPendingReview = doc.milestones?.some(
          (m: any) => m.status === "in_review"
        );
        if (role === "client" && hasPendingReview) pendingCount++;

        const dueSoon = doc.milestones?.find(
          (m: any) => m.status === "pending" && m.due_date !== "TBD"
        );
        if (role === "vendor" && dueSoon) pendingCount++;

        let isUrgent = false;
        let nextDeadline = "No deadlines";

        if (dueSoon) {
          const dueDate = new Date(dueSoon.due_date);
          const diffTime = Math.abs(dueDate.getTime() - Date.now());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 3) isUrgent = true;
          nextDeadline = dueDate.toLocaleDateString();
        }

        return {
          _id: doc._id.toString(),
          contractName: doc.contractName,
          status,
          createdAt: doc.createdAt.toISOString(),
          vendorEmail: doc.vendorEmail,
          totalValue: val,
          progress,
          clientName:
            role === "vendor"
              ? clientMap.get(doc.userId) || "Client"
              : undefined,
          nextDeadline,
          isUrgent,
        };
      }
    );

    return {
      role: role as "client" | "vendor",
      user: {
        name: dbUser.name || clerkUser.firstName || "User",
        email: dbUser.email,
        photo: dbUser.photo || clerkUser.imageUrl,
      },
      isAdmin: dbUser.currentRole === "admin",
      isBanned: Boolean(dbUser.isBanned),
      stats: {
        totalProjects: serializedProjects.length,
        activeCount: serializedProjects.filter((p) => p.status === "active")
          .length,
        completedCount: serializedProjects.filter(
          (p) => p.status === "completed"
        ).length,
        pendingCount,
        totalValue,
      },
      projects: serializedProjects,
    };
  } catch (error) {
    console.error("Dashboard Error:", error);
    return null;
  }
}
