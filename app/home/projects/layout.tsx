import { fetchProjects } from "@/app/helpers";
import { ProjectsProvider } from "@/app/stores/projects_store";

export default async function HomeProjectsLayout({ children }: { children: React.ReactNode }) {
    const projects = await fetchProjects()
    const projectsList = projects ? projects.data : []

    return (
        <ProjectsProvider projects={projectsList}>
            <div>
                {children}
            </div>
        </ProjectsProvider>
    )
}