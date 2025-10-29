import axios from "axios";
import { checkRateLimit } from "../../backend";
import { GoogleCallbackRequest } from "@/app/types";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    checkRateLimit(ip);
  } catch {
    return new Response(JSON.stringify({ detail: "Too many requests" }), {
      status: 429,
    });
  }
  const body: GoogleCallbackRequest = await req.json();
  const res = await axios
    .post(
      `${process.env.BACKEND_API_BASE}/api/v1/auth/google/callback`,
      {
        code: body.code,
        remember_me: true,
        accepted_terms: false,
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
            ).toString("base64"),
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      const headers = new Headers({
        "Content-Type": "application/json",
      });
      const setCookies = response.headers["set-cookie"];
      setCookies.forEach((cookie) => {
        headers.append("Set-Cookie", cookie);
      });
      const response1 = new Response(JSON.stringify(response.data), {
        status: response.status,
        headers: headers,
      });
      return response1;
    })
    .catch(function (error) {
      if (error.response) {
        return new Response(JSON.stringify(error.response.data), {
          status: error.response.status,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      return new Response(JSON.stringify(error), { status: 500 });
    });
  return res;
}
