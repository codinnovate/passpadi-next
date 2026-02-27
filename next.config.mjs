/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'passpadi.s3.amazonaws.com',
              port: '',
          },
          {
              protocol: 'https',
              hostname: 'api.dicebear.com',
              port: '',
          },
      ],
  },
};

export default nextConfig;
