import axios from "axios"
import { cookies } from "next/headers"
import { ProjectResponse, User, PaginatedResponse } from "./types";

export async function fetchProjects(): Promise<PaginatedResponse<ProjectResponse> | null> {
    try {
        const access_token = (await cookies()).get('access_token')?.value
        const response = await axios.get<PaginatedResponse<ProjectResponse>>(`${process.env.BACKEND_API_BASE}/api/v1/projects`, {
            headers: {
                "Cookie": `access_token=${access_token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        })
        return response.data
    } catch (err) {
        console.log("fetchProjects error", err)
        return null
    }
}


export async function getCurrentUser(): Promise<User | null> {
    const access_token = (await cookies()).get('access_token')?.value
    try {
        const res = await axios.get<User>(`${process.env.BACKEND_API_BASE}/api/v1/auth/me`, {
            headers: {
                "Cookie": `access_token=${access_token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        })
        return res.data
    } catch {
        return null
    }
}

export async function getProject(id: string): Promise<ProjectResponse | null> {
    try {
        const access_token = (await cookies()).get('access_token')?.value
        const response = await axios.get<ProjectResponse>(`${process.env.BACKEND_API_BASE}/api/v1/projects/${id}`, {
            headers: {
                "Cookie": `access_token=${access_token}`,
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        })
        return response.data
    } catch (err) {
        console.log("getProject error", err)
        return null
    }
};