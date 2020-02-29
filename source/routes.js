const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const pify = require("pify");
const joinURL = require("url-join");
const nested = require("nested-property");
const { Symbol: VulpesSymbols, convertTemplateToJobArray } = require("vulpes");
const { JOB_PROGRESS_CURRENT, JOB_PROGRESS_MAX } = require("./symbols.js");

const readFile = pify(fs.readFile);

const DIST = path.resolve(__dirname, "../dist");
const INDEX = path.join(DIST, "index.html");

const _jobTypeToRegex = jobType => new RegExp(`^${jobType.replace(/\*+/g, ".*")}$`);
const _jobTypesToRegex = jobTypes =>
    new RegExp(`(${jobTypes.map(type => _jobTypeToRegex(type).source).join("|")})`);

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
            limit: parseInt(req.query.limit, 10),
            order: req.query.order,
            sort: req.query.sort,
            start: req.query.start ? parseInt(req.query.start) : 0
        };
        const { search = "" } = req.query;
        const query =
            search.length > 0
                ? { type: type => type.toLowerCase().indexOf(search.toLowerCase()) >= 0 }
                : {};
        service
            .queryJobs(query, options)
            .then(jobs => ({
                jobs: stripJobResults(jobs),
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
    router.get("/job/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .getJob(jobID)
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
    router.get("/tree/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .getJobTree(jobID, { resolveParents: true })
            .then(jobs => stripJobResults(jobs))
            .then(jobs => {
                res.set("Content-Type", "application/json");
                res.status(200).send(jobs);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/start/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .startJob(jobID)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/stop/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .stopJob(jobID, VulpesSymbols.JOB_RESULT_TYPE_FAILURE)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/reset/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .resetJob(jobID)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/update/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        const mergedProperties = req.body.properties;
        service
            .updateJob(jobID, mergedProperties, { stripResults: true })
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/children/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .getJobChildren(jobID)
            .then(data => {
                res.set("Content-Type", "application/json");
                res.status(200).send(data);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.get("/artifact/:artifactID", function(req, res) {
        const { artifactID } = req.params;
        const { mime } = req.query;
        if (!mime) {
            console.error("No mime type set for artifact request");
            res.status(400).send("Bad request");
            return;
        }
        service.artifactManager
            .getArtifactReadStream(artifactID)
            .then(rs => {
                res.status(200);
                res.set("Content-Type", mime);
                rs.pipe(res);
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
    router.get("/delete/:jobID", function(req, res) {
        const jobID = req.params.jobID;
        service
            .removeJob(jobID)
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
    router.post("/import/batch", function(req, res) {
        const { template } = req.body;
        let rawJobs;
        try {
            rawJobs = convertTemplateToJobArray(template);
        } catch (err) {
            console.error(err);
            res.status(400).send("Bad request");
            return;
        }
        let tag = null;
        return service
            .addJobs(rawJobs)
            .then(jobs => {
                if (jobs.length > 0) {
                    tag = jobs[0].data.tag || null;
                }
                return jobs;
            })
            .then(jobs =>
                jobs.map(jobData => ({
                    id: jobData.id,
                    type: jobData.type,
                    parents: jobData.parents || []
                }))
            )
            .then(jobs => {
                res.status(200).send({
                    jobs,
                    tag
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
    router.post("/import/batch/dry", function(req, res) {
        const { template } = req.body;
        try {
            const jobs = convertTemplateToJobArray(template);
            res.status(200).send({
                jobs
            });
        } catch (err) {
            console.error(err);
            res.status(400).send("Bad request");
            return;
        }
    });
    router.post("/report/on-the-fly", function(req, res) {
        const {
            types: jobTypePatterns,
            reportingProperties,
            tagFilter = "",
            onlySucceeded = true
        } = req.body;
        const failRequest = () => res.status(400).send("Bad request");
        if (!Array.isArray(jobTypePatterns)) {
            console.error("Job type patterns (types) not provided");
            failRequest();
            return;
        }
        if (!Array.isArray(reportingProperties) || reportingProperties.length <= 0) {
            console.error("Report properties (reportingProperties) not provided");
            failRequest();
            return;
        }
        if (jobTypePatterns.length <= 0) {
            jobTypePatterns.push("*");
        }
        const jobType = _jobTypesToRegex(jobTypePatterns);
        const query = { type: jobType };
        if (tagFilter) {
            query["data.tag"] = tagFilter;
        }
        if (onlySucceeded) {
            query["result.type"] = VulpesSymbols.JOB_RESULT_TYPE_SUCCESS;
        }
        service
            .queryJobs(query)
            .then(jobs =>
                jobs.reduce((output, job) => {
                    const extractedValues = [];
                    reportingProperties.forEach(reportingProp => {
                        const { type: targetJobType, properties } = reportingProp;
                        const targetJobTypeRegex = _jobTypeToRegex(targetJobType);
                        if (!targetJobTypeRegex.test(job.type)) return;
                        properties.forEach(prop => {
                            const targetData = Object.assign({}, job.data, job.result.data || {});
                            const value = nested.get(targetData, prop);
                            if (typeof value !== "undefined") {
                                extractedValues.push({
                                    key: prop,
                                    value
                                });
                            }
                        });
                    });
                    if (extractedValues.length > 0) {
                        output.push({
                            id: job.id,
                            type: job.type,
                            properties: extractedValues
                        });
                    }
                    return output;
                }, [])
            )
            .then(results => {
                res.status(200).send({
                    results
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Internal server error");
            });
    });
}

function stripJobResults(jobs) {
    return jobs.map(job => {
        // Remove results data that could potentially be
        // too large to send - keep only very necessary
        // data points
        const existingData = job.result.data || {};
        job.result.data = {};
        [JOB_PROGRESS_CURRENT, JOB_PROGRESS_MAX].forEach(allowedKey => {
            job.result.data[allowedKey] = existingData[allowedKey];
        });
        return job;
    });
}

module.exports = {
    createRoutes
};
