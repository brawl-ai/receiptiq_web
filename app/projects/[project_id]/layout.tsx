import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FieldsProvider } from "../../lib/contexts/fields";
import { ProjectResponse } from "../../lib/types";
import { getProject } from "../../lib/helpers";

export const metadata: Metadata = {
  title: "Project",
};

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ project_id: string }>;
}) {
  const { project_id } = await params;

  const project: ProjectResponse = await getProject(project_id);
  if (!project) {
    notFound();
  }

  return (
    <Suspense>
      <FieldsProvider project={project}>{children}</FieldsProvider>
    </Suspense>
  );
}
