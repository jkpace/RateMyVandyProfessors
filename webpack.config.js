var path = require('path');

module.exports = {
  entry: {
    bundle: ['./src/content.ts'],
    background: ['./src/background.ts']
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
