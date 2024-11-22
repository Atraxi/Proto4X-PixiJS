const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
  },
  devServer: {
  },
  devtool: 'inline-source-map',
  plugins: [
    new HTMLWebpackPlugin({
      hash: true,
      minify: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        //{ from: "src", to: "dest" },
        { from: "assets", to: "public" },
      ],
    })
  ]
}