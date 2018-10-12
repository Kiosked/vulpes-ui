const path = require("path");
const express = require("express");
const webpack = require("webpack");
const execDevMiddleware = require("webpack-dev-middleware");
const execHotMiddleware = require("webpack-hot-middleware");
const { Service, FileStorage } = require("vulpes");
const { createVulpesRouter } = require("../source/index.js");
const webpackConfig = require("../webpack.config.js")({}, {
    mode: "development"
});
webpackConfig.entry.unshift("webpack-hot-middleware/client");

Object.assign(global, { __DEV__: true });

const compiler = webpack(Object.assign({ mode: "development" }, webpackConfig));
const app = express();
const storage = new FileStorage(path.resolve(__dirname,"../test/data/jobs.db.json"));
const service = new Service(storage);

service
    .initialise()
    .then(() => {
        const router = createVulpesRouter(service);
        app.use(execDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath
        }));
        app.use(execHotMiddleware(compiler));
        app.use("/", router);
        app.listen(8080, () => {
            console.log("Dev server listening on 8080:\n\thttp://localhost:8080/");
        });
    });
