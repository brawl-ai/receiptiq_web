import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FieldsProvider } from "../../lib/stores/fields_store";
import { ProjectResponse } from "../../lib/types";
import { getProject } from "../../lib/helpers";
import { ReceiptsProvider } from "../../lib/contexts/receipts";
import '@mantine/dropzone/styles.css';
import '@mantine/charts/styles.css';

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
      <FieldsProvider project={project}>
        <ReceiptsProvider project={project}>
          {children}
        </ReceiptsProvider>
      </FieldsProvider>
    </Suspense>
  );
}
