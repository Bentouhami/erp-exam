// path: next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                pathname: '/**', // Allow all images from this domain
            },
        ],
    },
    experimental: {
        taint: true,
    },
};

export default nextConfig;