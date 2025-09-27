import React from "react";
import Image from "next/image";
import sideImage from "../../../assets/authimage.png";
import SignupForm from "@/components/auth/SignupForm";
function page() {
  return (
    <div className="grid grid-cols-2 min-h-screen text-[#10151F]  ">
      <div className="relative ">
        <Image
          src={sideImage}
          alt="Side Image"
          fill
          className="w-full h-full"
        />
      </div>
      <div className="flex justify-center items-center ">
        <SignupForm />
      </div>
    </div>
  );
}

export default page;
