import React, { ReactNode } from "react";

interface ProjectLayoutProps {
  children: ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="project-layout">
      {/* You can add a sidebar, header, or project-specific navigation here */}
      <main>{children}</main>
    </div>
  );
}
