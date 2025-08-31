import axios from "axios";
import { GetOTPRequest } from "../../../types";
import { checkRateLimit } from "../../backend";


export async function POST(req: Request) {

    const ip = req.headers.get("x-forwarded-for") || "unknown"
    try {
        checkRateLimit(ip)
    } catch {
        return new Response(JSON.stringify({ detail: "Too many requests" }), {
            status: 429,
        })
    }

    const body: GetOTPRequest = await req.json()

    const res = await axios.post(`${process.env.BACKEND_API_BASE}/api/v1/auth/otp/get`,
        body,
        {
            headers: {
                Authorization: "Basic " + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
            }
        }
    )
        .then(function (response) {
            console.log(response, response.data)
            return new Response(JSON.stringify(response.data), { status: response.status })
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