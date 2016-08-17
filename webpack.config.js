const path = require('path')
const cssnext = require('postcss-cssnext')

const DEV = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: 'bundle.js',
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
}
