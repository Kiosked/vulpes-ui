const path = require("path");
const express = require("express");
const { Service, FileStorage, MemoryStorage } = require("vulpes");
const { createVulpesRouter } = require("../source/index.js");

Object.assign(global, { __DEV__: true });

const app = express();
// const storage = new FileStorage(path.resolve(__dirname, "../test/data/jobs.db.json"));
const storage = new MemoryStorage();
const service = new Service(storage);

service
    .initialise()
    .then(() => {
        const router = createVulpesRouter(service);
        app.use("/", router);
        app.listen(8080, () => {
            console.log("Dev server listening on 8080:\n\thttp://localhost:8080/");
        });
    });
