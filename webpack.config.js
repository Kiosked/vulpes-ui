const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const DIST = path.resolve(__dirname, "./dist");

module.exports = {
    entry: path.resolve(__dirname, "./source/web/index.js"),

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            },
            {
                test: /\.(png|jpg|gif|ttf|otf|woff|woff2|eot|svg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: `[name].[ext]`
                    }
                }
            }
        ]
    },

    output: {
        filename: "bundle.js",
        path: DIST
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Vulpes",
            template: path.resolve(__dirname, "./resources/template.pug"),
            filename: "index.html"
        })
    ]
};
