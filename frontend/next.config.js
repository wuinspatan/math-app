/** @type {import('next').NextConfig} */
const nextConfig = {
  // Expose the backend URL to the browser via NEXT_PUBLIC_ prefix
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
