import axios from "axios";
import { checkRateLimit } from "../../backend";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    checkRateLimit(ip);
  } catch {
    return new Response(JSON.stringify({ detail: "Too many requests" }), {
      status: 429,
    });
  }

  const res = await axios
    .get(`${process.env.BACKEND_API_BASE}/api/v1/auth/google/login`, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(function (response) {
      const headers = new Headers({
        "Content-Type": "application/json",
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
