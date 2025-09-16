import { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { FieldsProvider } from "../../stores/fields_store";
import { ProjectResponse } from "../../types";
import { getCurrentUser, getProject } from "../../helpers";
import { ReceiptsProvider } from "../../stores/receipts_store";
import { Sidebar, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { ProjectHeader } from "./components/ProjectHeader";
import { Toaster } from "@/components/ui/sonner";
import { ProjectSidebarNavigation } from "./ProjectSidebarNavigation";

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
                <SidebarMenuButton className="h-full">
                  <Link href="" className="flex items-center w-full h-full px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="44" viewBox="0 0 160 44" className="text-black-500 dark:text-white-500">
                      <rect x="2" y="2" width="40" height="40" rx="5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                      <path d="M12 22 L16 18 L20 26 L24 18 L28 26 L32 18 L36 26" stroke="currentColor" strokeWidth="3" fill="none" />
                      <text x="50" y="32" fontFamily="Arial, sans-serif" fill="currentColor" fontSize="20" fontWeight="bold">ReceiptIQ</text>
                    </svg>
                  </Link>
                </SidebarMenuButton>
              </SidebarHeader>
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
