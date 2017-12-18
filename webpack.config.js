var path = require('path');

module.exports = {
  entry: {
    bundle: ['./src/content.js'],
    background: ['./src/background.js']
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};
