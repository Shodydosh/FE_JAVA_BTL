/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'hanoicomputercdn.com',
            'cdn.tgdd.vn',
            'i.pinimg.com',
            'your-domain.com',
            'media.wiley.com',
            'hrcwelive.com',
            'm.media-amazon.com',
            'images-na.ssl-images-amazon.com',
            'upload.wikimedia.org',
            'i.harperapps.com',
            'ananas.vn',
            'pos.nvncdn.com',
            ''
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8080/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;

