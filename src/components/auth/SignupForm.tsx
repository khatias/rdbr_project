"use client";

import React, { useState } from "react";
import Link from "next/link";

function SignupForm() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);

    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("password_confirmation") || "");

    if (email.length < 3) {
      return setError("Email must be at least 3 characters.");
    }
    if (password.length < 3) {
      return setError("Password must be at least 3 characters.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) return setError(data?.message || "Registration failed");
    window.location.href = "/";
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="username" type="text" placeholder="Username" required />
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <input
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
          required
        />
        <button type="submit">register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        already member? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

export default SignupForm;
