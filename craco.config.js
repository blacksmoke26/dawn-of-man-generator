const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~redux': path.resolve(__dirname, 'src/redux'),
    },
  },
};
