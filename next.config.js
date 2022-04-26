/** @type {import('next').NextConfig} */
const nextConfig = {
  future: {
    webpack5: true,
  },
  reactStrictMode: true,
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY

  }
}

module.exports = nextConfig
