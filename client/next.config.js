// require("dotenv").config({
//     path: ".env",
// });

console.log(process.env.SERVER_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "**",
            },
        ],
    },
    env: {
        SERVER_URL: process.env.SERVER_URL
    }
};

module.exports = nextConfig;