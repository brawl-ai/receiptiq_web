import axios from "axios";
import { NextRequest } from "next/server";
import { ChangePasswordRequest } from "../../../types";
import { checkRateLimit } from "../../backend";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  try {
    checkRateLimit(ip);
  } catch {
    return new Response(JSON.stringify({ detail: "Too many requests" }), {
      status: 429,
    });
  }

  const data: ChangePasswordRequest = await req.json();
  const res = await axios
    .post(`${process.env.BACKEND_API_BASE}/api/v1/auth/password/change`, data, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString("base64"),
      },
    })
    .then(function (response) {
      return new Response(JSON.stringify(response.data), {
        status: response.status,
      });
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
