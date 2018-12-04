'use strict';

const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = () => {
  return {
    entry: {
      index: ['./app/index.tsx']
    },
    devtool: 'eval-source-map',
    optimization: {
      minimize: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            //
            // use transpileOnly mode to speed-up compilation; type checking is done in
            // a separate process using the ForkTsCheckerWebpackPlugin
            //
            transpileOnly: true
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader' //sass loader
            }
          ]
        }
      ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new ForkTsCheckerWebpackPlugin()],
    devServer: {
      quiet: false,
      noInfo: false,
      historyApiFallback: true,
      hot: true,
      stats: {
        // Config for minimal console.log mess.
        assets: true,
        colors: true,
        version: true,
        hash: true,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  };
};
