"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import sideImage from "../../../assets/authimage.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401 || res.status === 422) {
        return setError("Invalid email or password");
      }
      return setError(data?.message || "Login failed");
    }

    localStorage.setItem("currentUser", email);
    if (!localStorage.getItem(`avatar:${email}`)) {
      localStorage.setItem(`avatar:${email}`, "/avatar.jpg"); // default fallback
    }
    window.dispatchEvent(new Event("avatar:change"));

    window.location.href = "/";
  }

  const InsideLabel = ({ text }: { text: string }) => (
    <span
      className="
        pointer-events-none absolute left-3 top-1/2 -translate-y-1/2
        text-gray-500
        peer-focus:opacity-0
        peer-[&:not(:placeholder-shown)]:opacity-0
        transition-opacity
      "
    >
      {text} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className="grid grid-cols-2 min-h-screen text-[#10151F]">
      {/* Left side image */}
      <div className="relative">
        <Image
          src={sideImage}
          alt="Side Image"
          fill
          quality={100}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side form */}
      <div className="flex justify-center items-center">
        <div>
          <h2 className="text-[42px] font-semibold">Log in</h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-8">
            {/* Email */}
            <div className="relative w-[554px]">
              <input
                name="email"
                type="email"
                placeholder=" "
                required
                className="peer h-[42px] w-full rounded-[8px] border border-[#E1DFE1] px-3"
              />
              <InsideLabel text="Email" />
            </div>

            {/* Password with eye */}
            <div className="relative w-[554px]">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                required
                className="peer h-[42px] w-full rounded-[8px] border border-[#E1DFE1] px-3 pr-10"
              />
              <InsideLabel text="Password" />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3 mt-4 bg-[#FF4000] text-white font-medium"
              type="submit"
            >
              Log in
            </button>
          </form>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <p className="mt-4 text-center">
            Not a member?{" "}
            <Link href="/signup">
              <span className="text-[#FF4000]">Register</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
