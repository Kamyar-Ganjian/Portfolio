import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Use the compiler API: this environment adds notices to spawned CLI output.
  experimental: { useTypeScriptCli: false },
};
export default nextConfig;
