import axios from "axios";
import { checkRateLimit } from "../backend";
import { cookies } from "next/headers";


export async function POST(req: Request) {

    const ip = req.headers.get("x-forwarded-for") || "unknown"
    try {
        checkRateLimit(ip)
    } catch {
        return new Response(JSON.stringify({ detail: "Too many requests" }), {
            status: 429,
        })
    }

    const refresh_token = (await cookies()).get('refresh_token')?.value

    if (!refresh_token) {
        return new Response(JSON.stringify({ detail: "Missing refresh token" }), {
            status: 401,
        })
    }

    const res = await axios.post(`${process.env.BACKEND_API_BASE}/api/v1/auth/token/refresh`, null,
        {
            headers: {
                "Cookie": `refresh_token=${refresh_token}`,
                'Authorization': "Basic " + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
        .then(function (response) {
            const headers = new Headers({
                'Content-Type': 'application/json'
            });
            const setCookies = response.headers["set-cookie"];
            setCookies.forEach(cookie => {
                headers.append('Set-Cookie', cookie);
            });
            const response1 = new Response(
                JSON.stringify(response.data),
                {
                    status: response.status,
                    headers: headers
                }
            )
            return response1
        })
        .catch(function (error) {
            console.log(JSON.stringify(error.response.data))
            if (error.response) {
                return new Response(
                    JSON.stringify(error.response.data),
                    {
                        status: error.response.status,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            }
            return new Response(JSON.stringify(error), { status: 500 })
        });
    return res
}