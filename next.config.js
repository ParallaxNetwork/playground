/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    disableStaticImages: false,
    formats: ["image/avif", "image/webp"],
  },
  swcMinify: true,
}


module.exports = nextConfig



