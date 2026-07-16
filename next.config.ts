import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Moxie's cover is an SVG — next/image blocks SVG optimization by
    // default since it can carry inline script; sandbox it via CSP instead.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
