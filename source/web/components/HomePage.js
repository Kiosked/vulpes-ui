import React, { Component } from "react";
import PropTypes from "prop-types";
import { Callout, Intent, ProgressBar } from "@blueprintjs/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import humanDate from "human-date";
import VulpesSymbols from "vulpes/symbols.js";
import Layout from "./Layout.js";
import { JobStatShape, WorkerShape } from "../library/propTypes.js";
import { startTimer, stopTimer } from "../library/timers.js";

const {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT,
    JOB_STATUS_PENDING,
    JOB_STATUS_RUNNING,
    JOB_STATUS_STOPPED
} = VulpesSymbols;

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
const WorkersUpdatedText = styled.span`
    font-size: 10px;
    color: #333;
`;

export default class HomePage extends Component {
    static defaultProps = {
        jobStats: {
            totalJobs: 0,
            stoppedJobs: 0,
            runningJobs: 0,
            pendingJobs: 0,
            succeededJobs: 0,
            failedJobs: 0,
            jobsInLastHour: 0
        }
    };

    static propTypes = {
        jobStats: JobStatShape.isRequired,
        onReady: PropTypes.func.isRequired,
        serverTimestamp: PropTypes.number,
        workers: PropTypes.arrayOf(WorkerShape).isRequired
    };

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    render() {
        // const countsByResult = {
        //     [JOB_RESULT_TYPE_SUCCESS]: 0,
        //     [JOB_RESULT_TYPE_FAILURE]: 0,
        //     [JOB_RESULT_TYPE_FAILURE_SOFT]: 0,
        //     [JOB_RESULT_TYPE_TIMEOUT]: 0
        // };
        // const countsByStatus = {
        //     [JOB_STATUS_PENDING]: 0,
        //     [JOB_STATUS_RUNNING]: 0,
        //     [JOB_STATUS_STOPPED]: 0
        // };
        // this.props.jobs.forEach(job => {
        //     countsByStatus[job.status] += 1;
        //     const result = job.result.type;
        //     if (!result) {
        //         return;
        //     }
        //     countsByResult[result] += 1;
        // });
        const latestWorker = this.props.workers.sort((a, b) => b.updated - a.updated)[0];
        return (
            <Layout>
                <h1>Dashboard</h1>
                <Tabs defaultFocus={true}>
                    <CustomTabList>
                        <CustomTab>Stats</CustomTab>
                    </CustomTabList>
                    <TabPanel>
                        <JobRow>
                            <JobStat>
                                <Callout icon="tick" intent={Intent.SUCCESS} title="Succeeded jobs">
                                    <h3>{this.props.jobStats.succeededJobs}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="cross" intent={Intent.DANGER} title="Failed jobs">
                                    <h3>{this.props.jobStats.failedJobs}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="repeat" intent={Intent.PRIMARY} title="Running jobs">
                                    <h3>{this.props.jobStats.runningJobs}</h3>
                                </Callout>
                            </JobStat>
                        </JobRow>
                        <JobRow>
                            <JobStat>
                                <Callout icon="outdated" intent={Intent.NONE} title="Pending jobs">
                                    <h3>{this.props.jobStats.pendingJobs}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="time" intent={Intent.NONE} title="Jobs per hour">
                                    <h3>{this.props.jobStats.jobsInLastHour}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="th-list" intent={Intent.NONE} title="Total jobs">
                                    <h3>{this.props.jobStats.totalJobs}</h3>
                                </Callout>
                            </JobStat>
                        </JobRow>
                        <JobRow>
                            <JobStat>
                                <With
                                    intent={
                                        this.props.serverTimestamp
                                            ? this.props.workers.length > 0
                                                ? Intent.SUCCESS
                                                : Intent.DANGER
                                            : Intent.NONE
                                    }
                                    content={
                                        this.props.serverTimestamp ? this.props.workers.length : "?"
                                    }
                                >
                                    <Callout
                                        icon="applications"
                                        intent={intent}
                                        title="Live workers"
                                    >
                                        <h3>{content}</h3>
                                        <If condition={latestWorker}>
                                            <WorkersUpdatedText>
                                                Latest updated{" "}
                                                <strong>
                                                    {humanDate.relativeTime(
                                                        -1 *
                                                            ((this.props.serverTimestamp -
                                                                latestWorker.updated) /
                                                                1000)
                                                    )}
                                                </strong>
                                            </WorkersUpdatedText>
                                        </If>
                                    </Callout>
                                </With>
                            </JobStat>
                        </JobRow>
                    </TabPanel>
                </Tabs>
            </Layout>
        );
    }
}
