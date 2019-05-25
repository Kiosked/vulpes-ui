const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const pify = require("pify");
const joinURL = require("url-join");
const { Symbol: VulpesSymbols } = require("vulpes");
const { JOB_PROGRESS_CURRENT, JOB_PROGRESS_MAX } = require("./symbols.js");

const readFile = pify(fs.readFile);

const DIST = path.resolve(__dirname, "../dist");
const INDEX = path.join(DIST, "index.html");

function createRoutes(router, service) {
    router.use(
        bodyParser.urlencoded({
            extended: true,
            limit: "100mb"
        })
    );
    router.use(
        bodyParser.json({
            limit: "100mb"
        })
    );
    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );
        next();
    });

    router.get("/", (req, res) => {
        readFile(INDEX, "utf8")
            .then(indexSrc => {
                const apiBase = req.path.replace(/index\.html.+$/, "");
                res.send(indexSrc.replace("__VULPES_API_BASE__", apiBase));
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.use("/", express.static(DIST));
    router.get("/jobs", function(req, res) {
        const options = {
            limit: req.query.limit,
            order: req.query.order,
            sort: req.query.sort,
            start: req.query.start || 0
        };
        const { search = "" } = req.query;
        const query =
            search.length > 0
                ? { type: type => type.toLowerCase().indexOf(search.toLowerCase()) >= 0 }
                : {};
        service
            .queryJobs(query, options)
            .then(jobs => ({
                jobs: jobs.map(job => {
                    // Remove results data that could potentially be
                    // too large to send - keep only very necessary
                    // data points
                    const existingData = job.result.data || {};
                    job.result.data = {};
                    [JOB_PROGRESS_CURRENT, JOB_PROGRESS_MAX].forEach(allowedKey => {
                        job.result.data[allowedKey] = existingData[allowedKey];
                    });
                    return job;
                }),
                total: jobs.total
            }))
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/job/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJob(jobId)
            .then(data => {
                if (!data) {
                    res.status(404).send("Not found");
                    return;
                }
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/tree/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJobTree(jobId, { resolveParents: true })
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/start/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .startJob(jobId)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/stop/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .stopJob(jobId, VulpesSymbols.JOB_RESULT_TYPE_FAILURE)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/reset/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .resetJob(jobId)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/update/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        const mergedProperties = req.body.properties;
        service
            .updateJob(jobId, mergedProperties, { stripResults: true })
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/children/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .getJobChildren(jobId)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/add", function(req, res) {
        const properties = req.body.properties;
        service
            .addJob(properties)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/scheduled-tasks", function(req, res) {
        service.scheduler
            .getScheduledTasks()
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/scheduled-task/:id", function(req, res) {
        const taskID = req.params.id;
        service.scheduler
            .getScheduledTask(taskID)
            .then(task => {
                if (task) {
                    res.set("Content-Type", "application/json");
                    res.status(200).send(task);
                } else {
                    res.status(404).send("Not found");
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/scheduled-tasks/create", function(req, res) {
        const { title, schedule } = req.body;
        service.scheduler
            .addScheduledTask({
                title,
                schedule,
                enabled: false, // Enabled later
                jobs: []
            })
            .then(taskID => {
                res.set("Content-Type", "application/json");
                res.status(200).send({
                    id: taskID
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/scheduled-task/:id/status", function(req, res) {
        const taskID = req.params.id;
        const toState = req.body.enabled;
        if (typeof toState !== "boolean") {
            console.error("Expected 'enabled' to be a boolean value");
            res.status(400).send("Bad request");
            return;
        }
        service.scheduler
            .toggleTask(taskID, toState)
            .then(() => res.status(200).send(""))
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/scheduled-task/:id/details", function(req, res) {
        const taskID = req.params.id;
        const { title, schedule } = req.body;
        const updatePayload = {};
        if (title) {
            updatePayload.title = title;
        }
        if (schedule) {
            updatePayload.schedule = schedule;
        }
        service.scheduler
            .updateTaskProperties(taskID, updatePayload)
            .then(() => res.status(200).send(""))
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/scheduled-task/:id/trigger", function(req, res) {
        const taskID = req.params.id;
        service.scheduler
            .triggerTask(taskID)
            .then(() => res.status(200).send(""))
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.put("/scheduled-task/:id/jobs", function(req, res) {
        const taskID = req.params.id;
        const { jobs } = req.body;
        service.scheduler
            .setJobsForScheduledTask(taskID, jobs)
            .then(() => res.status(200).send(""))
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/scheduled-task/:id/job", function(req, res) {
        const taskID = req.params.id;
        const job = req.body.job;
        if (typeof job !== "object" || !job) {
            console.error("Expected 'job' to be a job object");
            res.status(400).send("Bad request");
            return;
        }
        service.scheduler
            .getScheduledTask(taskID)
            .catch(err => {
                err.status = 404;
                throw err;
            })
            .then(task => service.scheduler.setJobsForScheduledTask(taskID, [...task.jobs, job]))
            .then(() => res.status(200).send(""))
            .catch(err => {
                console.error(err);
                if (err.status === 404) {
                    res.status(404).send("Not found");
                } else {
                    res.status(500).send("Internal server error");
                }
            });
    });
    router.get("/delete/:jobId", function(req, res) {
        const jobId = req.params.jobId;
        service
            .removeJob(jobId)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/workers", function(req, res) {
        const workers = service.tracker.liveWorkers;
        res.status(200).send({
            workers,
            now: Date.now()
        });
    });
    router.get("/stats", function(req, res) {
        service.tracker
            .fetchStats()
            .then(stats => {
                res.status(200).send({
                    stats
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/log", function(req, res) {
        service.logger
            .readLogEntries()
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
}

module.exports = {
    createRoutes
};
