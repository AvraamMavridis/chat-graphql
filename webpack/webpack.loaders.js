const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');

const readFile = filePath => fs.readFileSync(path.resolve(filePath)).toString();

module.exports = function (options) {
  const loaders = [
    {
      test: /\.(js|jsx)$/,
      loaders: 'happypack/loader',
      include: [
        /src/,
      ]
    },
    {
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          // minimize html on production
          minimize: options.env === 'production'
        }
      }
    },
    {
      test: /\.(gif|png|jpe?g)$/i,
      loaders: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            progressive: true,
            optimizationLevel: 7,
            interlaced: false,
            pngquant: {
              quality: '65-90',
              speed: 4
            }
          }
        },
      ]
    },
    {
      test: /\.svg$/,
      loader: 'svg-inline-loader'
    },
  ];

  let sassLoader;

  sassLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({
      // Don't use hash in the file name itself, because we remove old files from S3
      filename: '[hash]_styles.css',

      fallbackLoader: 'style-loader',

      loader: [
        {
          loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        },
        {
          loader: 'autoprefixer-loader?browsers=last 2 version'
        },
        {
          loader: 'sass-loader'
        }
      ]
    })
  };

  loaders.push(sassLoader);


  return loaders;
};