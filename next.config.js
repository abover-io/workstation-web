const path = require('path');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    });

    return config;
  },
  distDir: '.next',
};

module.exports = withPlugins([], nextConfig);
