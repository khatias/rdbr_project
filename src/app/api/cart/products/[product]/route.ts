import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const API = "https://api.redseam.redberryinternship.ge/api";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const { product } = await context.params;
  const token = (await cookies()).get("token")?.value;
  const body = await request.json();

  const upstream = await fetch(`${API}/cart/products/${product}`, {
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
  const data = ct.includes("application/json") && text ? JSON.parse(text) : { message: text };

  return NextResponse.json(data, { status: upstream.status });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const { product } = await context.params;
  const token = (await cookies()).get("token")?.value;
  const body = await request.json(); // { quantity: number }

  const upstream = await fetch(`${API}/cart/products/${product}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "";
  const data = ct.includes("application/json") && text ? JSON.parse(text) : { message: text };

  return NextResponse.json(data, { status: upstream.status });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const { product } = await context.params;
  const token = (await cookies()).get("token")?.value;

  const upstream = await fetch(`${API}/cart/products/${product}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return new NextResponse(null, { status: upstream.status });
}
