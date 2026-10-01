/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // A page from the old Turbify site that Google still remembers.
      { source: "/inventory", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
