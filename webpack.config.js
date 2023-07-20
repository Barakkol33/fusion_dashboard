// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './public/js/app.js', // Replace with your entry point file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Replace with your output directory
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'), // Replace with the directory containing index.html
    },
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
