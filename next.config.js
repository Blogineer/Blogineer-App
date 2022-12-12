/** @type {import('next').NextConfig} */

const rewrites = {
  async rewrites() {
    return [
      {
        
        source: "/graphql/:path*",
        destination: "http://localhost:8000/:path*"
      }
    ]
  }
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...rewrites
}

module.exports = nextConfig
