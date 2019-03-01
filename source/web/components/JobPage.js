import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Symbol as VulpesSymbols } from "vulpes";
import _ from "lodash";
import { Icon, Button, Spinner } from "@blueprintjs/core";
import Layout from "./Layout";
import EditingData from "./EditingData";
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
const JOB_RESULT_MAP = {
    [JOB_RESULT_TYPE_FAILURE]: "Failed",
    [JOB_RESULT_TYPE_FAILURE_SOFT]: "Failed (Will retry)",
    [JOB_RESULT_TYPE_SUCCESS]: "Succeeded",
    [JOB_RESULT_TYPE_TIMEOUT]: "Failed (Timed out)"
};
const JOB_STATUS_MAP = {
    [JOB_STATUS_PENDING]: "Pending",
    [JOB_STATUS_RUNNING]: "Running",
    [JOB_STATUS_STOPPED]: "Stopped"
};

function parseDate(created) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(created);
    return date.toLocaleDateString("en-US", options);
}

const Buttons = styled.div`
    display: inline;
    padding-right: 20px;
`;
const IconButton = styled.span`
    cursor: pointer;
    display: flex;
    text-decoration: underline;
    flex-direction: row;
    align-items: center;
    width: auto;
`;
const JobHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;
const CustomTabList = styled.ul`
    list-style-type: none;
    width: 100%;
`;
const CustomTab = styled.li`
    display: inline;
    border-bottom: 5px solid #219bb6;
    margin-right: 15px;
    cursor: pointer;
`;
const Error = styled.div`
    color: #dc143c;
`;
const Success = styled.div`
    color: #228b22;
`;
const StyledButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
`;
const StyledIcon = styled(Icon)`
    margin-left: 5px;
`;

export default class JobPage extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        goToJobTreePage: PropTypes.func.isRequired,
        goToNewDependentJobPage: PropTypes.func.isRequired,
        goToNewJobPage: PropTypes.func.isRequired,
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        onReady: PropTypes.func.isRequired,
        resetJob: PropTypes.func.isRequired,
        stopJob: PropTypes.func.isRequired,
        updateJob: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            // failed: false,
            // message: "",
            editingData: false,
            editingResults: false
        };
    }

    componentDidMount() {
        this.props.onReady(this.props.jobID);
    }

    beginEditing(dataStr) {
        if (dataStr === "jobData") {
            this.setState({ editingData: !this.state.editingData });
        } else {
            this.setState({ editingResults: !this.state.editingResults });
        }
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.job}>
                    <Layout>
                        <CustomTabList>
                            <CustomTab onClick={() => this.props.goToJobPage(this.props.job.id)}>
                                Job details
                            </CustomTab>
                            <CustomTab
                                onClick={() => this.props.goToJobTreePage(this.props.job.id)}
                            >
                                Job tree
                            </CustomTab>
                        </CustomTabList>
                        <Buttons>
                            <StyledButton
                                icon="add"
                                text="New job"
                                onClick={this.props.goToNewJobPage}
                            />
                            <StyledButton
                                icon="add"
                                text="New dependent job"
                                onClick={this.props.goToNewDependentJobPage.bind(
                                    this,
                                    this.props.job.id
                                )}
                            />
                        </Buttons>
                        <h1>Job {this.props.job.id}</h1>
                        <JobHeader>
                            <h4>Type: {this.props.job.type}</h4>
                            <h4>
                                <strong>Status: </strong>
                                {JOB_STATUS_MAP[this.props.job.status]}
                            </h4>
                            <h4>Created: {parseDate(this.props.job.created)}</h4>
                        </JobHeader>
                        <h5>Data:</h5>
                        <IconButton onClick={this.beginEditing.bind(this, "jobData")}>
                            <Icon icon="edit" iconSize={25} /> Edit job data
                        </IconButton>
                        <If condition={!this.state.editingData}>
                            <ul>
                                {Object.values(this.props.job.data).map((data, index) => {
                                    return (
                                        <li key={index}>
                                            <strong>
                                                {Object.keys(this.props.job.data)[index]}:{" "}
                                            </strong>
                                            {data.toString()}
                                        </li>
                                    );
                                })}
                            </ul>
                        </If>
                        <If condition={this.state.editingData}>
                            <EditingData
                                data={this.props.job.data}
                                id={this.props.job.id}
                                dataStr="jobData"
                                saveData={this.sendDataForUpdate.bind(this)}
                            />
                        </If>
                        <h5>Result:</h5>
                        <ul>
                            <li>
                                <strong>
                                    Type:{" "}
                                    <span
                                        className={
                                            this.props.job.result.type
                                                ? this.props.job.result.type.replace(
                                                      "job/result/",
                                                      ""
                                                  )
                                                : ""
                                        }
                                    >
                                        {this.props.job.result.type
                                            ? JOB_RESULT_MAP[this.props.job.result.type]
                                            : ""}
                                    </span>
                                </strong>
                            </li>
                            <li>
                                <strong>Data:</strong>
                                <If condition={!_.isEmpty(this.props.job.result.data)}>
                                    <IconButton
                                        onClick={this.beginEditing.bind(this, "resultData")}
                                    >
                                        <Icon icon="edit" iconSize={25} /> Edit result data
                                    </IconButton>
                                    <If condition={!this.state.editingResults}>
                                        <ul>
                                            {Object.values(this.props.job.result.data).map(
                                                (data, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <strong>
                                                                {
                                                                    Object.keys(
                                                                        this.props.job.result.data
                                                                    )[index]
                                                                }
                                                                :{" "}
                                                            </strong>
                                                            {data.toString()}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </If>
                                    <If condition={this.state.editingResults}>
                                        <EditingData
                                            data={this.props.job.result.data}
                                            id={this.props.job.id}
                                            dataStr="resultData"
                                            saveData={this.sendDataForUpdate.bind(this)}
                                        />
                                    </If>
                                </If>
                            </li>
                        </ul>
                        <Buttons>
                            <Choose>
                                <When
                                    condition={
                                        this.props.job.status === JOB_STATUS_RUNNING ||
                                        this.props.job.status === JOB_STATUS_PENDING
                                    }
                                >
                                    <IconButton
                                        onClick={() => this.props.stopJob(this.props.jobID)}
                                    >
                                        <StyledIcon icon="stop" iconSize={25} /> Stop job
                                    </IconButton>
                                </When>
                                <When
                                    condition={
                                        this.props.job.status.replace("job/status/", "") ===
                                            "stopped" &&
                                        this.props.job.result.type.replace("job/result/", "") !==
                                            "success"
                                    }
                                >
                                    <IconButton
                                        onClick={() => this.props.resetJob(this.props.jobID)}
                                    >
                                        <StyledIcon icon="swap-horizontal" iconSize={20} /> Reset
                                        job
                                    </IconButton>
                                </When>
                                <Otherwise />
                            </Choose>
                        </Buttons>
                    </Layout>
                </When>
                <Otherwise>
                    <Spinner />
                </Otherwise>
            </Choose>
        );
    }

    sendDataForUpdate(dataStr, data, jobId) {
        const self = this;
        let properties;
        if (dataStr === "jobData") {
            properties = {
                data
            };
        } else {
            properties = {
                result: {
                    data,
                    type: self.props.job.result.type
                }
            };
        }
        this.props.updateJob(jobId, properties).then(() => {
            if (dataStr === "jobData") {
                self.setState({ editingData: false });
            } else {
                self.setState({ editingResults: false });
            }
        });
    }

    setResultData(e) {
        const name = e.target.getAttribute("name");
        this.setState({
            resultData: Object.assign({}, this.state.resultData, {
                [name]: e.target.value
            })
        });
    }
}
