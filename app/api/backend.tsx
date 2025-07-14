import { LRUCache } from "lru-cache"
import axios from 'axios'

const rateLimit = new LRUCache<string, number>({ max: 1000, ttl: 1000 * 60 })

export function checkRateLimit(ip: string) {
    const count = rateLimit.get(ip) || 0
    if (count >= 5) throw new Error("Too many requests")
    rateLimit.set(ip, count + 1)
}

export const backend = axios.create({
    baseURL: process.env.BACKEND_API_BASE,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
})

backend.interceptors.response.use(
    response => response,
    async error => {
        Promise.reject(error)
    }
)