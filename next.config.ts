import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "*.r2.dev" },
  { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
];

if (process.env.R2_PUBLIC_BASE_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_BASE_URL);
    remotePatterns.push({ protocol: "https", hostname: url.hostname });
  } catch {
    // ignore malformed env value, wildcard patterns above still cover r2.dev
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
