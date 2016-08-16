const autoprefixer = require('autoprefixer')

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname,
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
      { test: /\.css$/, loader: 'style!css?sourceMap!postcss?sourceMap=inline' },
    ],
  },
  postcss: () => [autoprefixer],
  devServer: {
    inline: true,
  },
  devtool: 'source-map',
  debug: true,
}
