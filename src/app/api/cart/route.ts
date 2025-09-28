
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = "https://api.redseam.redberryinternship.ge/api";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  const upstream = await fetch(`${API}/cart`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "";
  const data = ct.includes("application/json") && text ? JSON.parse(text) : { message: text };

  return NextResponse.json(data, { status: upstream.status });
}
