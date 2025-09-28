import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = "https://api.redseam.redberryinternship.ge/api";

export async function POST(
  req: Request,
  { params }: { params: { product: string } }
) {
  const token = (await cookies()).get("token")?.value;
  const body = await req.json();

  const upstream = await fetch(`${API}/cart/products/${params.product}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "";
  const data =
    ct.includes("application/json") && text
      ? JSON.parse(text)
      : { message: text };

  return NextResponse.json(data, { status: upstream.status });
}
