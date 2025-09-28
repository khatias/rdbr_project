// app/api/cart/checkout/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const API = "https://api.redseam.redberryinternship.ge/api";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;

  let body: unknown = undefined;
  try {
    body = await req.json();
  } catch {
    // no body provided
  }

  const upstream = await fetch(`${API}/cart/checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "";
  const data = ct.includes("application/json") && text ? JSON.parse(text) : { message: text || "" };

  return NextResponse.json(data, { status: upstream.status });
}
