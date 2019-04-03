import React, { Component } from "react";
import PropTypes from "prop-types";
import { Callout, ProgressBar } from "@blueprintjs/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";
import VulpesSymbols from "vulpes/symbols.js";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";

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

export default class HomePage extends Component {
    static propTypes = {
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        onReady: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        const countsByResult = {
            [JOB_RESULT_TYPE_SUCCESS]: 0,
            [JOB_RESULT_TYPE_FAILURE]: 0,
            [JOB_RESULT_TYPE_FAILURE_SOFT]: 0,
            [JOB_RESULT_TYPE_TIMEOUT]: 0
        };
        const countsByStatus = {
            [JOB_STATUS_PENDING]: 0,
            [JOB_STATUS_RUNNING]: 0,
            [JOB_STATUS_STOPPED]: 0
        };
        this.props.jobs.forEach(job => {
            countsByStatus[job.status] += 1;
            const result = job.result.type;
            if (!result) {
                return;
            }
            countsByResult[result] += 1;
        });
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
                                <Callout icon="tick" intent="success" title="Succeeded jobs">
                                    <h3>{countsByResult[JOB_RESULT_TYPE_SUCCESS]}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="cross" intent="danger" title="Failed jobs">
                                    <h3>
                                        {countsByResult[JOB_RESULT_TYPE_FAILURE] +
                                            countsByResult[JOB_RESULT_TYPE_FAILURE_SOFT] +
                                            countsByResult[JOB_RESULT_TYPE_TIMEOUT]}
                                    </h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="repeat" intent="primary" title="Running jobs">
                                    <h3>{countsByStatus[JOB_STATUS_RUNNING]}</h3>
                                </Callout>
                            </JobStat>
                        </JobRow>
                        <JobRow>
                            <JobStat>
                                <Callout icon="outdated" intent="none" title="Pending jobs">
                                    <h3>{countsByStatus[JOB_STATUS_PENDING]}</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="time" intent="none" title="Jobs per hour">
                                    <h3>?</h3>
                                </Callout>
                            </JobStat>
                            <JobStat>
                                <Callout icon="th-list" intent="none" title="Total jobs">
                                    <h3>{this.props.jobs.length}</h3>
                                </Callout>
                            </JobStat>
                        </JobRow>
                    </TabPanel>
                </Tabs>
            </Layout>
        );
    }
}
