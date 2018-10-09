const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

function createRoutes(router, service) {
    router.use(
        bodyParser.urlencoded({
            extended: true
        })
    );

    router.use(bodyParser.json());

    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });

    router.use("/", express.static(path.resolve(__dirname, "../dist")));
    router.get("/jobs", function(req, res) {
        const limit = req.query.limit;
        const options = { limit: limit, sort: "created", order: "desc" };
        service
            .queryJobs({}, options)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get("/job/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJob(jobId)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get("/tree/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJobTree(jobId, { resolveParents: true })
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get("/start/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .startJob(jobId)
            .then(data => {
                console.log(data);
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get("/stop/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .stopJob(jobId, "job/result/fail/timeout")
            .then(data => {
                console.log(data);
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get("/reset/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .resetJob(jobId)
            .then(data => {
                console.log(data);
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.post("/update/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        const mergedProperties = req.body.properties;
        console.log(mergedProperties);
        service
            .updateJob(jobId, mergedProperties)
            .then(data => {
                console.log(data);
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.get(`/children/:jobId`, function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJobChildren(jobId)
            .then(data => {
                console.log(data);
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
    router.post("/add", function(req, res) {
        const properties = req.body.properties;
        console.log(properties);
        service
            .addJob(properties)
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err.message);
            });
    });
}

module.exports = {
    createRoutes
};
