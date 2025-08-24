import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@tailwindcss/ui']
  }
}

export default nextConfig