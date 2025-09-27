"use client";

import React, { useState } from "react";
import Link from "next/link";

function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) {
      return setError(data?.message || "Login failed");
    }

    // redirect after successful login
    window.location.href = "/";
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Don’t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginForm;
