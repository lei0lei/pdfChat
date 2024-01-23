/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const path = require('path');


// module.exports = nextConfig
module.exports = withImages({
  output: "standalone",
  experimental: { 
    serverMinification: false 
  },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      });
      // config.resolve.alias['@'] = path.join('../../');
      return config;
    },
});

// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
      return [
          {
              // matching all API routes
              source: ":path*",
              headers: [
                  { key: "Access-Control-Allow-Credentials", value: "true" },
                  { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                  { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                  { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
              ]
          }
      ]
  }
}

