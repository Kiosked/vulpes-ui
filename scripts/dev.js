const path = require("path");
const express = require("express");
const { ArtifactManager, Service, FileStorage, MemoryStorage } = require("vulpes");
const { createVulpesRouter } = require("../source/index.js");

Object.assign(global, { __DEV__: true });

const app = express();
const storage = new FileStorage(path.resolve(__dirname, "../jobs.db.json"));
const artifactManager = new ArtifactManager("/tmp/vulpes");
const service = new Service({ artifactManager, storage });

service
    .initialise()
    .then(() => {
        const router = createVulpesRouter(service);
        app.use("/", router);
        app.listen(8080, () => {
            console.log("Dev server listening on 8080:\n\thttp://localhost:8080/");
        });
    });
