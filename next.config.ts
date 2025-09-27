import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.redseam.redberryinternship.ge",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
