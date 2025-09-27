"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import sideImage from "../../../assets/authimage.png";
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

    window.location.href = "/";
  }

  return (
    <div className="grid grid-cols-2 min-h-screen text-[#10151F]  ">
      <div className="relative ">
        <Image
          src={sideImage}
          alt="Side Image"
          fill
          quality={100}
          className=" h-full w-full"
        />
      </div>
      <div className="flex justify-center items-center ">
        <div className="">
          <h2 className="text-[42px] font-semibold ">Log in</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-8">
            <input
              name="email"
              type="email"
              placeholder="Email "
              required
              className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1]  px-3"
            />
            <button
              className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1]  px-3 mt-4 bg-[#FF4000] text-white font-medium"
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

export default LoginForm;
