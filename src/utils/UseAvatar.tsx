"use client";

import React from "react";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";

function readUploadedAvatar(): string | null {
  const email = localStorage.getItem("currentUser");
  if (!email) return null;
  const stored = localStorage.getItem(`avatar:${email}`);
 
  if (stored && stored.startsWith("data:")) return stored;
  return null;
}

export default function UserAvatar() {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const refresh = () => setSrc(readUploadedAvatar());
    refresh();
    window.addEventListener("avatar:change", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("avatar:change", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
      {src ? (
        <Image
          src={src}
          alt="User Avatar"
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <UserIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
      )}
    </div>
  );
}
