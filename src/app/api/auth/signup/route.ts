import { NextResponse } from "next/server";

const API_BASE = "https://api.redseam.redberryinternship.ge/api";

type RegisterResponse = {
  token?: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  const fd = await req.formData();

  const upstream = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: fd,
  });

  const ct = upstream.headers.get("content-type") ?? "";
  const text = await upstream.text();

  let data: RegisterResponse | null = null;
  if (ct.includes("application/json") && text) {
    try {
      data = JSON.parse(text) as RegisterResponse;
    } catch (err) {
      console.error("Failed to parse JSON response:", err);
    }
  }

  const res = NextResponse.json(data, { status: upstream.status });

  if (upstream.ok && data?.token) {
    res.cookies.set("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return res;
}
