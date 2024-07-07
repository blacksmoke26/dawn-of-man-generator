const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '~redux': path.resolve(__dirname, 'src/redux'),
    },
    module: {
      rules: [
        {
          test: /\.xml/i,
          use: [
            {
              loader: 'raw-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
      ],
    }
  },
};
