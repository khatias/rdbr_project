// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const API_BASE = "https://api.redseam.redberryinternship.ge/api";

export async function POST(req: Request) {
  // --- Parse JSON first; if that fails, fall back to FormData
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email || "");
    password = String(body?.password || "");
  } catch {
    const fd = await req.formData().catch(() => null);
    if (fd) {
      email = String(fd.get("email") || "");
      password = String(fd.get("password") || "");
    }
  }

  if (!email || !password) {
    const res = NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    // clear any stale token
    res.cookies.set("token", "", { path: "/", maxAge: 0, httpOnly: true });
    return res;
  }

  // --- Call upstream with JSON
  const upstream = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const raw = await upstream.text();
  const isJSON = (upstream.headers.get("content-type") || "").includes("application/json");
  const data = isJSON && raw ? JSON.parse(raw) : { message: raw || "" };

  if (!upstream.ok) {
    const msg =
      upstream.status === 401
        ? "Invalid email or password"
        : data?.message || "Login failed";
    const res = NextResponse.json({ message: msg }, { status: upstream.status });
    res.cookies.set("token", "", { path: "/", maxAge: 0, httpOnly: true });
    return res;
  }

  const token: string | undefined = data?.token;
  if (!token) {
    const res = NextResponse.json({ message: "No token returned" }, { status: 502 });
    res.cookies.set("token", "", { path: "/", maxAge: 0, httpOnly: true });
    return res;
  }

  const isLocal = process.env.NODE_ENV !== "production";
  const res = NextResponse.json({ user: data.user }, { status: 200 });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: !isLocal ? true : false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
