import { NextResponse } from "next/server";

const API_BASE = "https://api.redseam.redberryinternship.ge/api";

export async function POST(req: Request) {
  const fd = await req.formData();

  const upstream = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  });

  const ct = upstream.headers.get("content-type") || "";
  const text = await upstream.text();
  const data =
    ct.includes("application/json") && text ? JSON.parse(text) : null;

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
