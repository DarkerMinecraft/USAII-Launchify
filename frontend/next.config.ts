import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict Mode double-invokes effects in development, which opens two
  // simultaneous Live API WebSocket connections and puts them in a fight loop.
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
  webpack(config) {
    // Auth0 v4's DPoP utility uses a dynamic require() expression that
    // webpack can't statically analyze — it's intentional (optional peer dep).
    config.ignoreWarnings = [
      ...(config.ignoreWarnings ?? []),
      { module: /dpopUtils/ },
    ];
    return config;
  },
};

export default nextConfig;
