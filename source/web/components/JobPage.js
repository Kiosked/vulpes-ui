import React, { Component } from "react";
import styled from "styled-components";
import _ from "lodash";
import { Icon, Button } from "@blueprintjs/core";
import Loader from "react-loader-spinner";
import Layout from "./Layout";
import EditingData from "./EditingData";
import { fetchJob, startJob, stopJob, updateJob, resetJob } from "../library/app.js";

const Buttons = styled.div`
    display: inline;
    padding-right: 20px;
`;

const IconButton = styled.span`
    cursor: pointer;
    display: flex;
    text-decoration: underline;
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
    constructor(props) {
        super(props);
        this.state = {
            failed: false,
            message: "",
            editingData: false,
            editingResults: false
        };
    }

    componentDidMount() {
        const jobId = this.props.match.params.jobId;
        this.fetchJobById(jobId);
    }

    fetchJobById(jobId) {
        fetchJob(jobId);
    }

    parseDate(created) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(created);
        return date.toLocaleDateString("en-US", options);
    }

    beginEditing(dataStr) {
        if (dataStr === "jobData") {
            this.setState({ editingData: !this.state.editingData });
        } else {
            this.setState({ editingResults: !this.state.editingResults });
        }
    }

    startJob(jobId) {
        startJob(jobId)
            .then(res => {
                fetchJob(jobId).then(() => {
                    this.setState({ failed: false, message: "Job started" });
                });
            })
            .catch(err => {
                this.setState({ failed: true, message: err.message });
            });
    }

    stopJob(jobId) {
        stopJob(jobId)
            .then(res => {
                fetchJob(jobId).then(() => {
                    this.setState({ failed: false, message: "Job stopped" });
                });
            })
            .catch(err => {
                this.setState({ failed: true, message: err.message });
            });
    }

    resetJob(jobId) {
        resetJob(jobId)
            .then(res => {
                fetchJob(jobId).then(() => {
                    this.setState({ failed: false, message: "Job reset" });
                });
            })
            .catch(err => {
                this.setState({ failed: true, message: err.message });
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

    sendDataForUpdate(dataStr, data, jobId) {
        console.log(data);
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
        updateJob(jobId, properties)
            .then(() => {
                fetchJob(jobId).then(() => {
                    if (dataStr === "jobData") {
                        self.setState({ editingData: false });
                    } else {
                        self.setState({ editingResults: false });
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
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
                                {this.props.job.status.replace("job/status/", "")}
                            </h4>
                            <h4>Created: {this.parseDate(this.props.job.created)}</h4>
                        </JobHeader>
                        <h5>Data:</h5>
                        <If condition={!_.isEmpty(this.props.job.data)}>
                            <IconButton onClick={this.beginEditing.bind(this, "jobData")}>
                                Edit job data <Icon icon="edit" iconSize={25} />
                            </IconButton>
                        </If>
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
                                            ? this.props.job.result.type.replace("job/result/", "")
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
                                        Edit result data <Icon icon="edit" iconSize={25} />
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
                                        this.props.job.status.replace("job/status/", "") ===
                                        "pending"
                                    }
                                >
                                    <IconButton
                                        onClick={this.startJob.bind(this, this.props.job.id)}
                                    >
                                        Start job <StyledIcon icon="play" iconSize={25} />
                                    </IconButton>
                                </When>
                                <When
                                    condition={
                                        this.props.job.status.replace("job/status/", "") ===
                                        "running"
                                    }
                                >
                                    <IconButton
                                        onClick={this.stopJob.bind(this, this.props.job.id)}
                                    >
                                        Stop job <StyledIcon icon="stop" iconSize={25} />
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
                                        onClick={this.resetJob.bind(this, this.props.job.id)}
                                    >
                                        Reset job{" "}
                                        <StyledIcon icon="swap-horizontal" iconSize={20} />
                                    </IconButton>
                                </When>
                                <Otherwise />
                            </Choose>
                        </Buttons>
                        <If condition={this.state.message.length > 0}>
                            <If condition={this.state.failed}>
                                <Error>{this.state.message}</Error>
                            </If>
                            <If condition={!this.state.failed}>
                                <Success>{this.state.message}</Success>
                            </If>
                        </If>
                    </Layout>
                </When>
                <Otherwise>
                    <Loader type="Puff" color="#00BFFF" height="100" width="100" />
                </Otherwise>
            </Choose>
        );
    }
}
