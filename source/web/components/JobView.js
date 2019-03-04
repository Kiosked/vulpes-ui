import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import JSONView from "react-json-view";
import { Symbol as VulpesSymbols } from "vulpes";
import _ from "lodash";
import {
    Button,
    ButtonGroup,
    Callout,
    Card,
    Colors,
    HTMLTable,
    Icon,
    Menu,
    MenuItem,
    Popover,
    Spinner
} from "@blueprintjs/core";
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
const JOB_RESULT_FAILURES = [
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_TIMEOUT
];
const JOB_STATUS_MAP = {
    [JOB_STATUS_PENDING]: "Pending",
    [JOB_STATUS_RUNNING]: "Running",
    [JOB_STATUS_STOPPED]: "Stopped"
};

function parseDate(created) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    };
    const date = new Date(created);
    return date.toLocaleDateString("en-US", options);
}

const JobHeader = styled.div`
    line-height: 25px;
    margin-bottom: 12px;
    position: relative;
    > h1,
    pre {
        margin: 0px;
    }
    > span {
        font-size: 20px;
    }
`;
const TopRight = styled.div`
    position: absolute;
    right: 0px;
    top: 0px;
`;
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
const StyledButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
`;
const StyledIcon = styled(Icon)`
    margin-left: 5px;
`;
const StyledCard = styled(Card)`
    margin-bottom: 5px;
    padding: 4px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const ResultText = styled.span`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const ResultSuccess = ResultText.extend`
    color: ${Colors.GREEN4};
`;
const ResultFailure = ResultText.extend`
    color: ${Colors.RED4};
`;
const IconRightPadded = styled(Icon)`
    margin-right: 4px;
`;

export default class JobPage extends Component {
    static propTypes = {
        goToNewDependentJobPage: PropTypes.func.isRequired,
        goToNewJobPage: PropTypes.func.isRequired,
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        resetJob: PropTypes.func.isRequired,
        stopJob: PropTypes.func.isRequired,
        updateJob: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            editingData: false,
            editingResults: false
        };
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
                    <JobHeader>
                        <h1>
                            <pre>{this.props.job.id}</pre>
                        </h1>
                        <span>{this.props.job.type}</span>
                        <TopRight>
                            <Popover
                                content={
                                    <Menu>
                                        <MenuItem
                                            icon="plus"
                                            text="New Job"
                                            onClick={() => this.props.goToNewJobPage()}
                                        />
                                        <MenuItem
                                            icon="new-link"
                                            text="New Dependent Job"
                                            onClick={() =>
                                                this.props.goToNewDependentJobPage(
                                                    this.props.job.id
                                                )
                                            }
                                        />
                                    </Menu>
                                }
                            >
                                <Button icon="plus" />
                            </Popover>
                        </TopRight>
                    </JobHeader>
                    <Callout icon="calendar" title="Timestamps">
                        <HTMLTable>
                            <tbody>
                                <tr>
                                    <th>Created</th>
                                    <td>{parseDate(this.props.job.created)}</td>
                                </tr>
                                <If condition={this.props.job.times.firstStarted}>
                                    <tr>
                                        <th>First Run</th>
                                        <td>{parseDate(this.props.job.times.firstStarted)}</td>
                                    </tr>
                                </If>
                                <If condition={this.props.job.times.started}>
                                    <tr>
                                        <th>Last Run</th>
                                        <td>{parseDate(this.props.job.times.started)}</td>
                                    </tr>
                                </If>
                                <If condition={this.props.job.times.stopped}>
                                    <tr>
                                        <th>Stopped</th>
                                        <td>{parseDate(this.props.job.times.stopped)}</td>
                                    </tr>
                                </If>
                                <If condition={this.props.job.times.completed}>
                                    <tr>
                                        <th>Completed</th>
                                        <td>{parseDate(this.props.job.times.completed)}</td>
                                    </tr>
                                </If>
                            </tbody>
                        </HTMLTable>
                    </Callout>
                    <h4>Data</h4>
                    <StyledCard>
                        <Choose>
                            <When condition={this.props.job.status === JOB_STATUS_PENDING}>
                                <ResultText>
                                    <IconRightPadded icon="time" iconSize={16} />
                                    Pending
                                </ResultText>
                            </When>
                            <When condition={this.props.job.status === JOB_STATUS_STOPPED}>
                                <ResultText>
                                    <IconRightPadded icon="stop" iconSize={16} />
                                    Stopped
                                </ResultText>
                            </When>
                            <When condition={this.props.job.status === JOB_STATUS_RUNNING}>
                                <ResultText>
                                    <IconRightPadded icon="play" iconSize={16} />
                                    Running
                                </ResultText>
                            </When>
                        </Choose>
                        <ButtonGroup>
                            <Button
                                icon="edit"
                                disabled={this.props.job.status === JOB_STATUS_RUNNING}
                                onClick={this.beginEditing.bind(this, "jobData")}
                            >
                                Edit Data
                            </Button>
                        </ButtonGroup>
                    </StyledCard>
                    <If condition={!this.state.editingData}>
                        <JSONView src={this.props.job.data} />
                    </If>
                    <If condition={this.state.editingData}>
                        <EditingData
                            data={this.props.job.data}
                            id={this.props.job.id}
                            dataStr="jobData"
                            saveData={this.sendDataForUpdate.bind(this)}
                        />
                    </If>
                    <h4>Result</h4>
                    <StyledCard>
                        <Choose>
                            <When
                                condition={this.props.job.result.type === JOB_RESULT_TYPE_SUCCESS}
                            >
                                <ResultSuccess>
                                    <IconRightPadded icon="tick" iconSize={16} />
                                    Success
                                </ResultSuccess>
                            </When>
                            <When
                                condition={JOB_RESULT_FAILURES.includes(this.props.job.result.type)}
                            >
                                <ResultFailure>
                                    <IconRightPadded icon="cross" iconSize={16} />
                                    Failure ({JOB_RESULT_MAP[this.props.job.result.type]})
                                </ResultFailure>
                            </When>
                            <Otherwise>
                                <ResultText>
                                    <IconRightPadded icon="time" iconSize={16} />
                                    <i>No Result</i>
                                </ResultText>
                            </Otherwise>
                        </Choose>
                        <ButtonGroup>
                            <Button
                                icon="edit"
                                disabled={this.props.job.status === JOB_STATUS_RUNNING}
                                onClick={this.beginEditing.bind(this, "resultData")}
                            >
                                Edit Result Data
                            </Button>
                        </ButtonGroup>
                    </StyledCard>
                    <If condition={!_.isEmpty(this.props.job.result.data)}>
                        <If condition={!this.state.editingResults}>
                            <JSONView src={this.props.job.result.data} />
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
                    <Buttons>
                        <Choose>
                            <When
                                condition={
                                    this.props.job.status === JOB_STATUS_RUNNING ||
                                    this.props.job.status === JOB_STATUS_PENDING
                                }
                            >
                                <IconButton onClick={() => this.props.stopJob(this.props.jobID)}>
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
                                <IconButton onClick={() => this.props.resetJob(this.props.jobID)}>
                                    <StyledIcon icon="swap-horizontal" iconSize={20} /> Reset job
                                </IconButton>
                            </When>
                            <Otherwise />
                        </Choose>
                    </Buttons>
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
