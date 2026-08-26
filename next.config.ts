import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Produces .next/standalone with a self-contained server.js, so the Docker
  // runner stage needs no node_modules of its own.
  output: "standalone",

  compiler: {
    // SWC transform for styled-components. Turbopack compiles via SWC, so this
    // applies under Turbopack with no extra config — note that a `webpack()`
    // block would be ignored entirely, which is why the older
    // babel-plugin-styled-components recipes do not work here.
    //
    // It gives stable, deterministic class-name hashes across server and client
    // (hydration parity) plus readable displayName prefixes in dev.
    styledComponents: true,
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
