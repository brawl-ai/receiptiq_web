"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import api from "../axios";
import {
    ProjectResponse,
    ProjectCreate,
    ProjectUpdate
} from "../types";

interface ProjectsContextType {
    projects: ProjectResponse[];
    loading: boolean;
    error: string | null;
    createProject: (data: ProjectCreate) => Promise<ProjectResponse>;
    updateProject: (id: string, data: ProjectUpdate) => Promise<ProjectResponse>;
    deleteProject: (id: string) => Promise<void>;
    fetchProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

type PaginatedProjects = {
    total: number
    page: number
    size: number
    data: ProjectResponse[]
}

export function ProjectsProvider({ children }: { children: ReactNode }) {

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<PaginatedProjects>("/api/v1/projects");
            setProjects(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to fetch projects");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (data: ProjectCreate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post<ProjectResponse>(
                "/api/v1/projects",
                data
            );
            setProjects((prev) => [...prev, response.data]);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create project");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id: string, data: ProjectUpdate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put<ProjectResponse>(
                `/api/v1/projects/${id}`,
                data
            );
            setProjects((prev) => prev.map((p) => (p.id === id ? response.data : p)));
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to update project");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/api/v1/projects/${id}`);
            setProjects((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to delete project");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                loading,
                error,
                createProject,
                updateProject,
                deleteProject,
                fetchProjects
            }}
        >
            {children}
        </ProjectsContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectsContext);
    if (context === undefined) {
        throw new Error("useProjects must be used within a ProjectsProvider");
    }
    return context;
}
