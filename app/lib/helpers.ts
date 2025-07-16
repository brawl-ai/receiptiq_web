import axios from "axios"
import { cookies } from "next/headers"
import { User } from "./types"


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