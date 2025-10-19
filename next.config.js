// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        unoptimized: true,
        remotePatterns: [ 
            // localhost
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.receiptiq.co',
                pathname: '/files/**',
            }
         ],
    }
}

module.exports = nextConfig