/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig
module.exports = {
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });

      return config;
    },
}