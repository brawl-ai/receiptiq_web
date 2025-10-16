// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [ 
            // localhost
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/**',
            },
            // receiptiq
            {
                protocol: 'https',
                hostname: 'api.receiptiq.co',
                port: '443',
                pathname: '/**',
            }
         ],
    }
}

module.exports = nextConfig