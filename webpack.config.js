const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const devMode = process.env.NODE_ENV !== "production";
module.exports = {
  mode: 'development',
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      exclude: /node_modules/,
    },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.js', '.css'],
  },
  devServer: {
  },
  devtool: devMode ? 'inline-source-map' : undefined,
  optimization: devMode ? undefined : {
    minimizer: [new UglifyJSPlugin({
        uglifyOptions: {
            output: {
                comments: false //use it for removing comments like "/*! ... */"
            }
        }
    })]
  },
  plugins: [
    new HTMLWebpackPlugin({
      hash: true,
      minify: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "assets", to: "public" },
      ],
    })
  ]
}