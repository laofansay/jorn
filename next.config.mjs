/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Allow builds to succeed even with TypeScript errors
  },
  webpack(config) {
    config.externals.push("canvas");
    return config;
  },
};
export default nextConfig;
