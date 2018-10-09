const express = require("express");
const { Service, FileStorage } = require("vulpes");
const { createVulpesRouter } = require("../source/index.js");
const path = require("path");

const app = express();
const storage = new FileStorage(path.resolve(__dirname,"../test/data/jobs.db.json"));
const service = new Service(storage);

service
    .initialise()
    .then(() => {
        const router = createVulpesRouter(service);
        app.use("/", router);
        app.listen(8081, () => {
            console.log("Dev server listening on 8081");
        });
    });
