const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // Changed the entry point to a .tsx file.
  entry: './src/index.ts',

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'react-resource-scheduler.js',
  },

  // Enable sourcemaps for debugging Webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js'],
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
    ],
  },

  plugins: [
    /* new HtmlWebpackPlugin({
      template: './example/index.html',
    }), */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-US)$/),
    // new webpack.DllReferencePlugin({
    //     context: root,
    //     manifest: require('../exampledist/static/vendors-manifest.json')
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //     output: {
    //         comments: false,  // remove all comments
    //     },
    //     compress: {
    //         warnings: false
    //     }
    // }),
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
    //new BundleAnalyzerPlugin()
    //new ExtractTextPlugin("bundle.css")
  ],

  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    antd: 'antd',
    react: 'React',
    moment: 'moment',
    'react-dom': 'ReactDOM',
    rrule: 'rrule',
  },

  performance: {
    hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000,
  },
};
