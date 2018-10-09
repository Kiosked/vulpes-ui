import React, { Component } from "react";
import { Callout, ProgressBar } from "@blueprintjs/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import Layout from "./Layout.js";
import { fetchJobs } from "../library/app.js";

const JobStat = styled.div`
    width: 50%;
    margin-right: 5px;
`;

const SubBar = styled.div`
    width: 50%;
    margin-top: 5px;
    margin-bottom: 5px;
    display: block;
`;

const JobRow = styled.div`
    margin-top: 10px;
    display: flex;
    width: 100%;
`;

const CustomTabList = styled(TabList)`
    list-style-type: none;
    width: 100%;
`;

const CustomTab = styled(Tab)`
    display: inline;
    border-bottom: 5px solid #219bb6;
    margin-right: 15px;
    cursor: pointer;
`;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: []
        };
    }

    componentDidMount() {
        fetchJobs(Infinity).then(res => {
            this.setState({ jobs: res });
        });
    }

    getJobStatusValue(status) {
        const total = this.state.jobs.length;
        const statusTotal = this.state.jobs.filter(
            job => job.status.replace("job/status/", "") === status
        ).length;
        const percentage = (statusTotal * 100) / total;
        return percentage / 100;
    }

    getJobResultValue(result) {
        const stoppedJobs = this.state.jobs.filter(
            job => job.status.replace("job/status/", "") === "stopped"
        );
        const total = stoppedJobs.length;
        const resultTotal = stoppedJobs.filter(
            job =>
                job.result.type ? job.result.type.replace("job/result/", "").includes(result) : ""
        ).length;
        const percentage = (resultTotal * 100) / total;
        return percentage / 100;
    }

    render() {
        return (
            <If condition={this.state.jobs.length > 0}>
                <Layout>
                    <h1>Dashboard</h1>
                    <h2>Number of jobs: {this.state.jobs.length}</h2>
                    <Tabs defaultFocus={true}>
                        <CustomTabList>
                            <CustomTab>Numbers</CustomTab>
                            <CustomTab>Progress bars</CustomTab>
                        </CustomTabList>
                        <TabPanel>
                            <JobRow>
                                <JobStat>
                                    <Callout icon="tick" intent="success" title="Succeeded jobs">
                                        <h3>
                                            {
                                                this.state.jobs.filter(
                                                    job =>
                                                        job.result.type
                                                            ? job.result.type.replace(
                                                                  "job/result/",
                                                                  ""
                                                              ) === "success"
                                                            : ""
                                                ).length
                                            }
                                        </h3>
                                    </Callout>
                                </JobStat>
                                <JobStat>
                                    <Callout icon="cross" intent="danger" title="Failed jobs">
                                        <h3>
                                            {
                                                this.state.jobs.filter(
                                                    job =>
                                                        job.result.type
                                                            ? job.result.type
                                                                  .replace("job/result/", "")
                                                                  .includes("fail")
                                                            : ""
                                                ).length
                                            }
                                        </h3>
                                    </Callout>
                                </JobStat>
                            </JobRow>
                            <JobRow>
                                <JobStat>
                                    <Callout icon="repeat" intent="primary" title="Running jobs">
                                        <h3>
                                            {
                                                this.state.jobs.filter(
                                                    job =>
                                                        job.status.replace("job/status/", "") ===
                                                        "running"
                                                ).length
                                            }
                                        </h3>
                                    </Callout>
                                </JobStat>
                                <JobStat>
                                    <Callout icon="outdated" intent="none" title="Pending jobs">
                                        <h3>
                                            {
                                                this.state.jobs.filter(
                                                    job =>
                                                        job.status.replace("job/status/", "") ===
                                                        "pending"
                                                ).length
                                            }
                                        </h3>
                                    </Callout>
                                </JobStat>
                            </JobRow>
                            <JobRow>
                                <JobStat>
                                    <Callout icon="time" intent="none" title="Jobs per hour">
                                        <h3>?</h3>
                                    </Callout>
                                </JobStat>
                            </JobRow>
                        </TabPanel>
                        <TabPanel>
                            <h3>Running jobs</h3>
                            <ProgressBar
                                intent="primary"
                                value={this.getJobStatusValue("running")}
                                animate={true}
                            />
                            <h3>Stopped jobs</h3>
                            <ProgressBar
                                intent="primary"
                                value={this.getJobStatusValue("stopped")}
                                animate={false}
                            />
                            <SubBar>
                                <h4>Stopped jobs - success</h4>
                                <ProgressBar
                                    intent="success"
                                    value={this.getJobResultValue("success")}
                                    animate={false}
                                />
                            </SubBar>
                            <SubBar>
                                <h4>Stopped jobs - fail</h4>
                                <ProgressBar
                                    intent="danger"
                                    value={this.getJobResultValue("fail")}
                                    animate={false}
                                />
                            </SubBar>
                            <h3>Pending jobs</h3>
                            <ProgressBar
                                intent="none"
                                value={this.getJobStatusValue("pending")}
                                animate={false}
                            />
                        </TabPanel>
                    </Tabs>
                </Layout>
            </If>
        );
    }
}
