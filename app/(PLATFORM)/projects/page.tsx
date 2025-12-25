import { Metadata } from "next";
import { ProjectsClient } from "@/components/pages/projects/projects-client";

export const metadata: Metadata = {
  title: "Projects | AI Contract Analysis",
  description: "Securely upload and analyze legal documents.",
};

export default function ProjectsPage() {
  return (


      <ProjectsClient initialProjects={[]} />

  );
}
