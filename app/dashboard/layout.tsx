import { Metadata } from "next"
import { Suspense } from "react"
import { fetchProjects, getCurrentUser } from "../helpers"
import { redirect } from "next/navigation"
import { SubscriptionsProvider } from "../stores/subscription_store"
import { ProjectsProvider } from "../stores/projects_store"
import { createTheme, MantineProvider } from "@mantine/core"


export const metadata: Metadata = {
    title: "Dashboard"
}

const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
});

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
            <MantineProvider theme={theme} defaultColorScheme="auto">
                <SubscriptionsProvider>
                    <ProjectsProvider projects={projectsList}>
                        {children}
                    </ProjectsProvider>
                </SubscriptionsProvider>
            </MantineProvider>
        </Suspense>
    )
}