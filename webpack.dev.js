const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',

  // Changed the entry point to a .tsx file.
  entry: './example/index.tsx',

  output: {
    path: path.join(__dirname, '/example'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/example/',
  },

  // Enable sourcemaps for debugging Webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['*', '.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$|\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.scss$|\.css$|\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      { test: /\.(jpe?g|png|gif)$/i, loader: 'url?limit=10000!img?progressive=true' },
      { test: /\.json/, loader: 'json-loader', exclude: /node_modules/ },
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/antd\/lib\/style\/index\.less/,
      path.resolve(__dirname, '/src/less/antd-global-include.less'),
    ),
  ],
};
