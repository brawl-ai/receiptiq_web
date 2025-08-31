"use client";

import { createStore } from "zustand/vanilla";
import {
  ProjectResponse,
  ProjectCreate,
  ProjectUpdate,
  PaginatedResponse
} from "../types";
import api from "../axios";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

interface ProjectsStoreProps {
  projects: ProjectResponse[];
}

interface ProjectsStateType extends ProjectsStoreProps {
  createProject: (data: ProjectCreate) => Promise<ProjectResponse>;
  updateProject: (id: string, data: ProjectUpdate) => Promise<ProjectResponse>;
  deleteProject: (id: string) => Promise<void>;
}

type ProjectsStoreType = ReturnType<typeof createProjectsStore>;

const createProjectsStore = (initProps?: Partial<ProjectsStoreProps>) => {
  const DEFAULT_PROPS: ProjectsStoreProps = {
    projects: [],
  };
  return createStore<ProjectsStateType>()((set, get) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    createProject: async (data) => {
      const response = await api.post("/api/v1/projects", data);
      set((state) => ({ ...state, projects: [...state.projects, response.data] }));
      return response.data;
    },
    updateProject: async (id, data) => {
      const response = await api.put(`/api/v1/projects/${id}`, data);
      set((state) => ({
        ...state,
        projects: state.projects.map((p) => (p.id === id ? response.data : p)),
      }));
      return response.data;
    },
    deleteProject: async (id) => {
      await api.delete(`/api/v1/projects/${id}`);
      set((state) => ({
        ...state,
        projects: state.projects.filter((p) => p.id !== id),
      }));
    },
  }));
};

type ProjectsProviderProps = React.PropsWithChildren<ProjectsStoreProps>;

const ProjectsContext = createContext<ProjectsStoreType | null>(null);

export function ProjectsProvider({ children, projects }: ProjectsProviderProps) {
  const storeRef = useRef<ProjectsStoreType>(null);
  if (!storeRef.current) {
    storeRef.current = createProjectsStore({ projects });
  }
  return (
    <ProjectsContext.Provider value={storeRef.current}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext<T>(selector: (state: ProjectsStateType) => T): T {
  const store = useContext(ProjectsContext);
  if (!store) throw new Error("Missing ProjectsContext.Provider in the tree");
  return useStore(store, selector);
}
