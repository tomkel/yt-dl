const cssnext = require('postcss-cssnext')

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
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?sourceMap!postcss?sourceMap=inline',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style!css?sourceMap',
      },
    ],
  },
  postcss: () => [cssnext],
  devServer: {
    inline: true,
  },
  devtool: 'source-map',
  debug: true,
}
