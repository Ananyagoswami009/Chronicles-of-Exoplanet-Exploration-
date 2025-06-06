/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }];
      return config;
    },
  }
  
  module.exports = nextConfig