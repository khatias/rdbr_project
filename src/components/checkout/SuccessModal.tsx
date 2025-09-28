// components/checkout/SuccessModal.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import vector from "@/assets/Vector.png";

export default function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-white flex items-center justify-center"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded p-1 hover:bg-slate-100"
      >
        <XMarkIcon className="h-10 w-10 stroke-2 " />
      </button>

      <div className="flex flex-col items-center justify-center text-center px-6">
        <div className="mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#F8F6F7]">
          <Image src={vector} alt="Success" width={36} height={29} />
        </div>

        <h1 className="text-[44px] font-semibold text-[#10151F]">Congrats!</h1>
        <p className="mt-4 text-[#3E424A]">Your order is placed successfully</p>

        <div className="mt-14 flex items-center justify-center gap-3">
          <Link
            href="/listing"
            className="inline-block rounded-md bg-[#FF4000] px-4 py-[10px] w-[214px]  text-center text-white hover:bg-[#e03e00]"
          >
            Continue shopping
          </Link>
 
        </div>
      </div>
    </div>
  );
}
