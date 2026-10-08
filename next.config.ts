import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/dashboard/:path*",
        destination: "/admin/dashboard/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/admin/dashboard",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
