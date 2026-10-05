/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static HTML in /out — no server needed
  images: { unoptimized: true },
}

export default nextConfig
