/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app', '*.ngrok-free.app']
    }
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    OPENMIC_API_KEY: process.env.OPENMIC_API_KEY,
    OPENMIC_BASE_URL: process.env.OPENMIC_BASE_URL,
    NGROK_URL: process.env.NGROK_URL,
    NEXT_PUBLIC_NGROK_URL: process.env.NEXT_PUBLIC_NGROK_URL
  }
};

export default nextConfig;
