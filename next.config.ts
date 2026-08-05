import type { NextConfig } from "next";

// No nonce/middleware setup (this site is fully static-optimized, and nonces
// require dynamic rendering, which would give that up). Next.js's own inline
// hydration bootstrap scripts (self.__next_f.push(...)) need 'unsafe-inline'
// in that case — see https://nextjs.org/docs/app/guides/content-security-policy
// ("Without Nonces"). Everything else stays locked to 'self': no third-party
// scripts, fonts, or fetches run here.
// Dev needs 'unsafe-eval' for React Fast Refresh / dev-mode stack traces.
// Never shipped to production, where the CSP stays fully locked down.
const isDev = process.env.NODE_ENV !== 'production';

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  images: {
    // Moxie's cover is an SVG — next/image blocks SVG optimization by
    // default since it can carry inline script; sandbox it via CSP instead.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
