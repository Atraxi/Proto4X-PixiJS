const CopyWebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css'],
    },
    devServer: {
    },
    devtool: 'inline-source-map',
    plugins: [
        new HTMLWebpackPlugin({
        }),
        new CopyWebpackPlugin({
            patterns: [
                //{ from: "src", to: "dest" },
                { from: "assets", to: "public" },
            ],
        })
    ]
}