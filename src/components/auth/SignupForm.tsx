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
    <div className="flex justify-center items-center ">
      <div className="">
        <h2 className="text-[42px] font-semibold ">Register</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-8">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3"
          />
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirm Password"
            required
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3"
          />
          <button
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1]  px-3 mt-4 bg-[#FF4000] text-white font-medium"
            type="submit"
          >
            register
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="mt-4 text-center">
          {" "}
          <p>
            already member? <Link href="/login"> <span className="text-[#FF4000] font-medium">Log in</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
