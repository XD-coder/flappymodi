/** @type {import('next').NextConfig} */
// Use environment variables to control basePath/assetPrefix so deployments
// (Vercel, Cloudflare Pages, GitHub Pages) can opt-in to serving under a
// sub-path like `/flappy/`. By default we serve from root which matches
// Vercel's default behavior.
const basePath = process.env.NEXT_BASE_PATH || "";
// If you need a separate asset prefix (CDN or GitHub Pages) set NEXT_ASSET_PREFIX.
const assetPrefix = process.env.NEXT_ASSET_PREFIX || basePath || "";

module.exports = {
  basePath: basePath || undefined,
  assetPrefix: assetPrefix || undefined,
  images: {
    unoptimized: true,
  },
};
