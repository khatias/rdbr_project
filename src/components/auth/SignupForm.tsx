"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f) {
      const url = URL.createObjectURL(f);
      setFile(f);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    localStorage.removeItem("avatar");
  }

  function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("password_confirmation") || "");

    if (email.length < 3)
      return setError("Email must be at least 3 characters.");
    if (password.length < 3)
      return setError("Password must be at least 3 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    if (file) {
      const b64 = await fileToBase64(file);
      localStorage.setItem(`avatar:${email}`, b64);
    } else {
      localStorage.removeItem(`avatar:${email}`);
    }
    localStorage.setItem("currentUser", email);
    localStorage.removeItem("avatar"); // legacy cleanup
    window.dispatchEvent(new Event("avatar:change")); // update header in same tab

    const res = await fetch("/api/auth/signup", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) return setError(data?.message || "Registration failed");

    window.location.href = "/listing";
  }

  return (
    <div className="flex justify-center items-center">
      <div>
        <h2 className="text-[42px] font-semibold">Register</h2>

        <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-8">
          <div className="flex items-center gap-5">
            <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Avatar"
                  fill
                  className="object-cover rounded-full border border-gray-300"
                  unoptimized
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full rounded-full border border-dashed border-gray-300 bg-gray-50 grid place-items-center text-xs text-gray-500"
                >
                  Upload photo
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                aria-label="Upload avatar"
              />
            </div>

            {file && (
              <div className="flex items-center gap-[15px]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-[#3E424A]"
                >
                  Upload New
                </button>
                <button type="button" onClick={handleRemove}>
                  Remove
                </button>
              </div>
            )}
          </div>

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
            className="h-[42px] w-[554px] rounded-[8px] border border-[#E1DFE1] px-3 mt-2 bg-[#FF4000] text-white font-medium"
            type="submit"
          >
            Register
          </button>
        </form>

        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}

        <div className="mt-4 text-center">
          <p>
            already member?{" "}
            <Link href="/login" className="text-[#FF4000] font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
