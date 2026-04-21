import type { NextConfig } from "next";

// Subdirectory path when previewing at pavankumarkolla-prof.github.io/pavankumar.com/.
// Unset once DNS is configured and the site serves at https://pavankumar.com/ root.
// Flip with:  PAGES_PREVIEW=1 npm run build
const previewBasePath = process.env.PAGES_PREVIEW ? "/pavankumar.com" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: previewBasePath,
  assetPrefix: previewBasePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
