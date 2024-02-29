/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "harmless-woodpecker-662.convex.cloud",
        port: "",
      },
    ],
  },
};

export default nextConfig;
