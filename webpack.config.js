const path = require('path')
const cssnext = require('postcss-cssnext')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const DEV = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: ['babel-polyfill', 'isomorphic-fetch', './index.js'],
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'bundle.[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: DEV ? 'style!css?sourceMap!postcss?sourceMap=inline' : 'style!css!postcss?compress',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: DEV ? 'style!css?sourceMap' : 'style!css?minimize&-autoprefixer',
      },
    ],
  },
  postcss: () => [cssnext],
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      hash: true,
    }),
    new CleanWebpackPlugin('./dist'),
  ],
}
