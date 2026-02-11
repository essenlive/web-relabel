import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dl.airtable.com',
            },
        ],
    },
    transpilePackages: ['react-p5-wrapper'],
    serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
