const path = require('path')
const webpack = require('webpack')
const BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,
  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    './assets/js/index.jsx',
  ],

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: 'bundle.js',
    publicPath: '/static/bundles/',
  },

  plugins: [
    new BundleTracker({ filename: './webpack-stats-prod.json' }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, // to transform JSX into JS
    ],
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx', '.json'],
  },
  node: {
    fs: 'empty',
    module: 'empty',
    net: 'empty',
  },
}
