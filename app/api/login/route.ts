import axios from "axios";
import { checkRateLimit } from "../backend";
import { LoginRequest } from "../../lib/types";


export async function POST(req: Request) {

    const ip = req.headers.get("x-forwarded-for") || "unknown"
    try {
        checkRateLimit(ip)
    } catch {
        return new Response(JSON.stringify({ detail: "Too many requests" }), {
            status: 429,
        })
    }

    const body: LoginRequest = await req.json()

    const res = await axios.post(`${process.env.BACKEND_API_BASE}/api/v1/auth/token`,
        {
            username: body.email,
            password: body.password,
            grant_type: "password",
            remember_me: body.remember_me,
            scope: "read:profile write:profile read:projects write:projects delete:projects process:projects read:fields write:fields delete:fields read:receipts write:receipts delete:receipts read:data export:data"
        },
        {
            headers: {
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