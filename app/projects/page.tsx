"use client"
import { useAuth } from "../lib/auth"


export default function ProjectsPage() {
    const { user } = useAuth()
    return (
        <div>
            <h1>Welcome back {user.first_name} {user.email}</h1>
            <h2>Projects Page</h2>
        </div>
    )
}