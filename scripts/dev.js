const express = require("express");
const { Service } = require("vulpes");
const { createVulpesRouter } = require("../source/index.js");

const app = express();
const service = new Service();

service
    .initialise()
    .then(() => {
        const router = createVulpesRouter(service);
        app.use("/", router);
        app.listen(8081, () => {
            console.log("Dev server listening on 8081");
        });
    });
