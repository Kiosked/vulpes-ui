const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require("webpack");
const rimraf = require("rimraf").sync;

const DIST = path.resolve(__dirname, "./dist");
const RESOURCES = path.resolve(__dirname, "./resources");

rimraf(DIST);

function getPlugins(mode) {
    const plugins = [
        new MiniCSSExtractPlugin({
            filename: "[name].css"
        }),
        new HtmlWebpackPlugin({
            title: "Vulpes",
            template: path.resolve(__dirname, "./resources/template.pug"),
            filename: "index.html"
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(RESOURCES, "favicon*"),
                flatten: true
            }
        ])
    ];
    if (mode === "development") {
        console.log("Loading dev plugins");
        plugins.push(
            new HotModuleReplacementPlugin(),
            new NoEmitOnErrorsPlugin()
        );
    }
    return plugins;
}

module.exports = (env, argv) => ({
    entry: [
        path.resolve(__dirname, "./source/web/index.js"),
    ],

    mode: argv.mode,

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
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    },

    output: {
        filename: "bundle.js",
        path: DIST,
        publicPath: "/"
    },

    node: {
        fs: "empty"
    },

    plugins: getPlugins(argv.mode || "development")
});
