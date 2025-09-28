// components/Header.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { UserIcon } from "@heroicons/react/24/solid";
import CartButton from "@/components/cart/CartButton";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
// If you keep the asset import, make sure the filename + path case match EXACTLY
import logo from "../../assets/Logo.png"; // <- check case on disk (Logo.png vs logo.png)

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthed = !!token;

  return (
    <header className="w-full h-20 flex items-center justify-between px-[100px]">
      <Link href="/" aria-label="Go to homepage" prefetch>
        <Image
          src={logo}
          alt="Logo"
          width={180}
          height={24}
          priority
          sizes="(max-width: 768px) 140px, 180px"
        />
      </Link>

      <div className="flex items-center ">
        {isAuthed ? (
          <>
            <CartButton />
            <Link
              href=""
              aria-label="Account"
              className="flex items-center gap-3 ml-5"
            >
              <span className="w-[40px] h-[40px] rounded-full bg-amber-700 " />
            </Link>
            <ChevronDownIcon className="h-5 w-5 text-gray-800" />
          </>
        ) : (
          <Link href="/login" className="flex items-center gap-2">
            <UserIcon className="h-[20px] w-[20px] text-gray-800" />
            <span className="text-lg text-[#10151F]">log in</span>
          </Link>
        )}
      </div>
    </header>
  );
}
