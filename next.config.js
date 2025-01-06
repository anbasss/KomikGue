/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['klikcdn.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.klikcdn.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://kurokami.vercel.app/api/:path*',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
                ],
            },
        ];
    },
    experimental: {
        largePageDataBytes: 128 * 100000, // Increase limit for large responses
    }
}

module.exports = nextConfig
