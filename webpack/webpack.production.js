const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const webpack = require('webpack');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const HappyPackPlugin = require('./happypack.loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const swVersion = require('../src/config').swVersion;


module.exports = function (options) {
  const isFastMode = process.argv.includes('--fast');

  return {
    cache: true,
    devtool: isFastMode ? 'eval' : 'source-map',
    entry: [
      "babel-core/register",
      "babel-polyfill",
      'whatwg-fetch',
      './src/index.js'
    ],
    performance: {
      hints: process.argv.includes('--analyze'),
    },
    output: {
      path: path.join(__dirname, '../build'),
      filename: '[hash]bundle.js',
      publicPath: './'
    },
    plugins: [
      HappyPackPlugin,
      new WriteFilePlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('local'),
        'process.env': {
          NODE_ENV: JSON.stringify('local')
        }
      }),
      new DuplicatePackageCheckerPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/index.template.html')
      }),
      new ExtractTextPlugin('[hash]styles.css'),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { reduceIdents: { keyframes: false } }
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '../assets/'),
          to: path.join(__dirname, '../build/assets/')
        },
        {
          from: path.join(__dirname, '../src/css'),
          to: path.join(__dirname, '../build/css/')
        },
        {
          from: path.join(__dirname, '../src/manifest.json'),
          to: path.join(__dirname, '../build/manifest.json')
        },
        {
          from: path.join(__dirname, '../src/favicon.ico'),
          to: path.join(__dirname, '../build/favicon.ico')
        },
        {
          from: path.join(__dirname, '../src/sw.js'),
          to: path.join(__dirname, `../build/sw-${ swVersion }.js`),
        },
        {
          from: path.join(__dirname, '../src/cachepolyfill.js'),
          to: path.join(__dirname, '../build/cachepolyfill.js'),
        }
      ]),
      new FaviconsWebpackPlugin({
        // Your source logo
        logo: path.join(__dirname, '../assets/images/popcorn.png'),
        // The prefix for all image files (might be a folder or a name)
        prefix: 'favicons/',
        // Emit all stats of the generated icons
        emitStats: true,
        // Generate a cache file with control hashes and
        // don't rebuild the favicons until those hashes change
        persistentCache: true,
        // Inject the html into the html-webpack-plugin
        inject: true,
        // favicon app title (see https://github.com/haydenbleasel/favicons#usage)
        title: 'MYCS',

        // which icons should be generated (see https://github.com/haydenbleasel/favicons#usage)
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: false
        }
      })
    ],
    devServer: {
      contentBase: path.join(__dirname, '../build'),
      compress: !isFastMode,
      host: '127.0.0.1',
      port: 8000,
      clientLogLevel: 'info',
      disableHostCheck: true,
      historyApiFallback: true,
      stats: 'normal',
      inline: true
    },
    stats: 'normal',
    module: {
      loaders: loaders(options)
    }
  };
};
