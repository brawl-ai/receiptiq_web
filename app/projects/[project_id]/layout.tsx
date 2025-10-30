import { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { FieldsProvider } from "../../stores/fields_store";
import { ProjectResponse } from "../../types";
import { getCurrentUser, getProject } from "../../helpers";
import { ReceiptsProvider } from "../../stores/receipts_store";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { ProjectHeader } from "./components/ProjectHeader";
import { Toaster } from "@/components/ui/sonner";
import { ProjectSidebarNavigation } from "./ProjectSidebarNavigation";
import { Separator } from "@/components/ui/separator";

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
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  const project: ProjectResponse = await getProject(project_id);
  if (!project) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return (
    <Suspense>
      <FieldsProvider project={project}>
        <ReceiptsProvider project={project}>
          <SidebarProvider style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }>
            <Sidebar variant="inset" >
              <SidebarHeader>
                <Link href="" className="flex items-center cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="150" height="44" viewBox="0 0 220 64" className="mt-2">
                    {/* Rounded square on the left */}
                    <rect x="2" y="2" width="60" height="60" rx="5" stroke="currentColor" strokeWidth="2" fill="white" />
                    {/* Squiggly line in the center */}
                    <path d="M12 32 L16 28 L20 36 L24 28 L28 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36 L55 32" stroke="black" strokeWidth="3" fill="none" />
                    {/* Text next to it */}
                    <text x="75" y="40" fontFamily="Roboto, sans-serif" fill="currentColor" fontSize="30">
                      ReceiptIQ
                    </text>
                  </svg>
                </Link>
              </SidebarHeader>
              <Separator orientation="horizontal" />
              <ProjectSidebarNavigation projectId={project.id} />
              <SidebarFooter>
                <NavUser user={{
                  name: user.first_name + " " + user.last_name,
                  email: user.email,
                  initials: getInitials(user.first_name + " " + user.last_name),
                }} />
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <ProjectHeader title={project.name} isSubscribed={user?.is_subscribed} />
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ReceiptsProvider>
      </FieldsProvider>
    </Suspense >
  );
}
