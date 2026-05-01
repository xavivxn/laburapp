import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/avatars/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "production"
                ? "public, max-age=0, must-revalidate"
                : "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
