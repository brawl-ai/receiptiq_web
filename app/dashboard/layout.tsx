import { Metadata } from "next"
import { Suspense } from "react"
import { fetchProjects, getCurrentUser } from "../lib/helpers"
import { redirect } from "next/navigation"
import { SubscriptionsProvider } from "../lib/stores/subscription_store"
import { ProjectsProvider } from "../lib/stores/projects_store"


export const metadata: Metadata = {
    title: "Dashboard"
}

export default async function ProjectsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }
    const projects = await fetchProjects()
    const projectsList = projects.data
    return (
        <Suspense>
            <SubscriptionsProvider>
                <ProjectsProvider projects={projectsList}>
                    {children}
                </ProjectsProvider>
            </SubscriptionsProvider>
        </Suspense>
    )
}