import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import JSONView from "react-json-view";
import VulpesSymbols from "vulpes/symbols.js";
import _ from "lodash";
import {
    Alert,
    Button,
    ButtonGroup,
    Callout,
    Card,
    Colors,
    HTMLTable,
    Icon,
    Intent,
    Menu,
    MenuItem,
    Popover,
    ProgressBar,
    Spinner,
    Tag
} from "@blueprintjs/core";
import { getJobProgress } from "../library/progress.js";
import EditingData from "./EditingData";
import Attachments from "./Attachments.js";
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

function filterViewableData(data) {
    return Object.keys(data).reduce((output, key) => {
        return /^%/.test(key) ? output : { ...output, [key]: data[key] };
    }, {});
}

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
    margin-right: 10px !important;
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
const ResultSuccess = styled(ResultText)`
    color: ${Colors.GREEN4};
`;
const ResultFailure = styled(ResultText)`
    color: ${Colors.RED4};
`;
const IconRightPadded = styled(Icon)`
    margin-right: 4px;
`;
const ProgressContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 6px;
`;
const ProgressBarContainer = styled.div`
    flex-grow: 3;
`;
const ProgressValue = styled.div`
    flex: 0 0 auto;
    font-weight: bold;
    padding-left: 6px;
`;

export default class JobPage extends Component {
    static propTypes = {
        goToNewDependentJobPage: PropTypes.func.isRequired,
        goToNewJobPage: PropTypes.func.isRequired,
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        removeAttachment: PropTypes.func.isRequired,
        resetJob: PropTypes.func.isRequired,
        stopJob: PropTypes.func.isRequired,
        updateJob: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            editingData: false,
            editingResults: false,
            modalOpen: false
        };
    }

    beginEditing(dataStr) {
        if (dataStr === "jobData") {
            this.setState({ editingData: !this.state.editingData });
        } else {
            this.setState({ editingResults: !this.state.editingResults });
        }
    }

    toggleModal() {
        this.setState({ modalOpen: !this.state.modalOpen });
    }

    render() {
        const progress = this.props.job ? getJobProgress(this.props.job) : 0;
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
                    <If condition={progress > 0 && this.props.job.status === JOB_STATUS_RUNNING}>
                        <ProgressContainer>
                            <ProgressBarContainer>
                                <ProgressBar intent={Intent.PRIMARY} value={progress} />
                            </ProgressBarContainer>
                            <ProgressValue>
                                <Tag minimal>{Math.floor(progress * 100)}%</Tag>
                            </ProgressValue>
                        </ProgressContainer>
                    </If>
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
                        <JSONView src={filterViewableData(this.props.job.data)} />
                    </If>
                    <If condition={this.state.editingData}>
                        <EditingData
                            data={filterViewableData(this.props.job.data)}
                            id={this.props.job.id}
                            dataStr="jobData"
                            onSaveData={::this.sendDataForUpdate}
                            onCancel={() => this.setState({ editingData: null })}
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
                    <If condition={!this.state.editingResults}>
                        <JSONView src={filterViewableData(this.props.job.result.data)} />
                    </If>
                    <If condition={this.state.editingResults}>
                        <EditingData
                            data={filterViewableData(this.props.job.result.data)}
                            id={this.props.job.id}
                            dataStr="resultData"
                            onSaveData={this.sendDataForUpdate.bind(this)}
                            onCancel={() => this.setState({ editingResults: null })}
                        />
                    </If>
                    <Buttons>
                        <ButtonGroup>
                            <Choose>
                                <When
                                    condition={
                                        this.props.job.status === JOB_STATUS_RUNNING ||
                                        this.props.job.status === JOB_STATUS_PENDING
                                    }
                                >
                                    <StyledButton
                                        text="Stop job"
                                        icon="stop"
                                        onClick={() => this.props.stopJob(this.props.jobID)}
                                    />
                                </When>
                                <When condition={this.props.job.status === JOB_STATUS_STOPPED}>
                                    <StyledButton
                                        text="Reset job"
                                        icon="swap-horizontal"
                                        onClick={() => this.props.resetJob(this.props.jobID)}
                                    />
                                </When>
                                <Otherwise />
                            </Choose>
                            <StyledButton
                                text="Delete job"
                                icon="trash"
                                intent={Intent.DANGER}
                                onClick={() => this.toggleModal()}
                            />
                        </ButtonGroup>
                        <Alert
                            cancelButtonText="Cancel"
                            confirmButtonText="Delete job"
                            icon="trash"
                            intent={Intent.DANGER}
                            isOpen={this.state.modalOpen}
                            onCancel={() => this.toggleModal()}
                            onConfirm={() => this.props.deleteJob(this.props.jobID)}
                        >
                            <p>
                                Are you sure you want to permanently delete job with the ID
                                <strong>{this.props.job.id}</strong>
                            </p>
                        </Alert>
                    </Buttons>
                    <Attachments
                        onRemoveAttachment={id => this.props.removeAttachment(id)}
                        results={this.props.job ? this.props.job.result.data : {}}
                    />
                </When>
                <Otherwise>
                    <Spinner />
                </Otherwise>
            </Choose>
        );
    }

    sendDataForUpdate(dataType, data, jobId) {
        const self = this;
        let properties;
        if (dataType === "jobData") {
            properties = {
                data: {
                    ...data,
                    ...Object.keys(this.props.job.data).reduce(
                        (invisible, key) =>
                            /^%/.test(key)
                                ? { ...invisible, [key]: this.props.job.data[key] }
                                : invisible,
                        {}
                    )
                }
            };
        } else {
            properties = {
                result: {
                    data: {
                        ...data,
                        ...Object.keys(this.props.job.result.data).reduce(
                            (invisible, key) =>
                                /^%/.test(key)
                                    ? { ...invisible, [key]: this.props.job.result.data[key] }
                                    : invisible,
                            {}
                        )
                    },
                    type: self.props.job.result.type
                }
            };
        }
        this.props.updateJob(jobId, properties).then(() => {
            if (dataType === "jobData") {
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
