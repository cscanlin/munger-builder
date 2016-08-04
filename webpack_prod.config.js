const path = require('path')
const BundleTracker = require('webpack-bundle-tracker')

module.exports = {
  context: __dirname,

  // entry point of our app.
  // assets/js/index.js should require other js modules and dependencies it needs
  entry: [
    'babel-polyfill',
    './assets/js/index.jsx',
  ],

  output: {
    path: path.resolve('./assets/distributions'),
    filename: 'active-bundle.js',
  },

  plugins: [
    new BundleTracker({ filename: './webpack-stats-prod.json' }),
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
