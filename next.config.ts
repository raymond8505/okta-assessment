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

  experimental: {
    // Every generated CSS <link> becomes an inline <style>, removing the
    // render-blocking request Lighthouse flags as a critical request chain.
    // Cheap here: the only external CSS is the ~7 KB grid + normalize chunk —
    // everything else is already inlined by the styled-components registry.
    // Costs repeat visitors stylesheet caching. Production builds only.
    inlineCss: true,
  },

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

  async redirects() {
    return [
      // Storybook's built HTML references every asset relatively ("./assets/…",
      // "./sb-manager/…"). Verified against the actual build output — both the
      // manager and the preview iframe — so no Vite `base` override is needed.
      //
      // The catch is the URL without a trailing slash: at "/storybook", "./"
      // resolves to "/" and every asset 404s. Redirecting to the explicit
      // index.html fixes the base for the manager, and the iframe is always
      // requested at its own full path.
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: false,
      },
    ];
  },

  async headers() {
    // Storybook is excluded: it renders stories inside an <iframe>, which
    // X-Frame-Options would block.
    return [{ source: "/((?!storybook).*)", headers: securityHeaders }];
  },
};

export default nextConfig;
