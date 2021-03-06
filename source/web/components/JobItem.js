import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Elevation, Button, Icon, Intent, Spinner } from "@blueprintjs/core";
import VulpesSymbols from "vulpes/symbols.js";
import { JobShape } from "../library/propTypes.js";
import { getJobProgress } from "../library/progress.js";

const {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT,
    JOB_STATUS_PENDING,
    JOB_STATUS_RUNNING,
    JOB_STATUS_STOPPED
} = VulpesSymbols;

function backgroundColourForResult(job) {
    switch (job.result.type) {
        case JOB_RESULT_TYPE_FAILURE:
        /* falls-through */
        case JOB_RESULT_TYPE_FAILURE_SOFT:
        /* falls-through */
        case JOB_RESULT_TYPE_TIMEOUT:
            return "rgba(255,0,0,0.03)";
        case JOB_RESULT_TYPE_SUCCESS:
            return "rgba(0,255,0,0.03)";
        default:
            return "#FFF";
    }
}

function jobResult(job) {
    switch (job.result.type) {
        case JOB_RESULT_TYPE_FAILURE:
        /* falls-through */
        case JOB_RESULT_TYPE_FAILURE_SOFT:
        /* falls-through */
        case JOB_RESULT_TYPE_TIMEOUT:
            return "failure";
        case JOB_RESULT_TYPE_SUCCESS:
            return "success";
        default:
            return null;
    }
}

function jobStatus(job) {
    switch (job.status) {
        case JOB_STATUS_PENDING:
            return "pending";
        case JOB_STATUS_RUNNING:
            return "running";
        case JOB_STATUS_STOPPED:
        /* falls-through */
        default:
            return "stopped";
    }
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

const StyledCard = styled(Card)`
    margin-bottom: 5px;
    padding: 0px;
    background: ${props => props.background};
`;
const PaddedValue = styled.span`
    padding: 4px 5px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;
const JobID = styled.span`
    font-size: 12px;
    font-family: monospace;
`;
const JobStatus = styled.span`
    font-size: 12px;
    margin-left: 6px;
    color: #555;
`;
const JobPriority = styled.span`
    font-size: 12px;
    margin-left: 6px;
    color: #555;
`;
const JobType = styled.span`
    color: #777;
`;
const JobCreatedDate = styled.span`
    color: #666;
    font-size: 11px;
`;
const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: stretch;
`;
const JobTopRow = styled(Row)`
    justify-content: space-between;
    border-bottom: 1px solid #eee;
`;
const JobDetailCell = styled.div`
    border-left: 1px solid #eee;
`;
const ProgressContainer = styled.div`
    flex-grow: 2;
    position: relative;
    background-color: #b3cfff;
`;
const ProgressBar = styled.div`
    position: absolute;
    height: 100%;
    top: 0px;
    right: 0px;
    width: ${props => 100 - (props.width || 0)}%;
    background-color: #fff;
    overflow: hidden;
`;
const ProgressTextOnWhite = styled.div`
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: #888;
    padding: 0 8px;
`;
const ProgressTextOnColour = styled(ProgressTextOnWhite)`
    color: #fff;
`;

export default class JobItem extends Component {
    static propTypes = {
        job: JobShape.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render() {
        const { job } = this.props;
        const status = jobStatus(job);
        const result = jobResult(job);
        const progress = getJobProgress(job);
        return (
            <StyledCard
                interactive={true}
                elevation={Elevation.TWO}
                key={job.id}
                onClick={() => this.props.onClick()}
                background={backgroundColourForResult(job)}
            >
                <JobTopRow>
                    <PaddedValue>
                        <JobID>{job.id}</JobID>
                    </PaddedValue>
                    <PaddedValue>
                        <JobType>{job.type}</JobType>
                    </PaddedValue>
                </JobTopRow>
                <Row>
                    <If condition={progress > 0 && job.status === JOB_STATUS_RUNNING}>
                        <ProgressContainer>
                            <ProgressTextOnColour>
                                {Math.floor(progress * 100)}%
                            </ProgressTextOnColour>
                            <ProgressBar width={progress * 100}>
                                <ProgressTextOnWhite>
                                    {Math.floor(progress * 100)}%
                                </ProgressTextOnWhite>
                            </ProgressBar>
                        </ProgressContainer>
                    </If>
                    <JobDetailCell>
                        <PaddedValue>
                            <JobCreatedDate>{parseDate(job.created)}</JobCreatedDate>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <Choose>
                                <When condition={job.priority === 0}>
                                    <Icon icon="dot" intent={Intent.NONE} />
                                    <JobPriority>normal</JobPriority>
                                </When>
                                <When condition={job.priority > 0}>
                                    <Icon icon="caret-up" intent={Intent.NONE} />
                                    <JobPriority>high</JobPriority>
                                </When>
                                <When condition={job.priority < 0}>
                                    <Icon icon="caret-down" intent={Intent.NONE} />
                                    <JobPriority>low</JobPriority>
                                </When>
                            </Choose>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <Choose>
                                <When condition={result === "success"}>
                                    <Icon icon="tick" intent={Intent.SUCCESS} />
                                </When>
                                <When condition={result === "failure"}>
                                    <Icon icon="warning-sign" intent={Intent.DANGER} />
                                </When>
                                <Otherwise>
                                    <Icon icon="pulse" intent={Intent.NONE} />
                                </Otherwise>
                            </Choose>
                            <JobStatus>{result ? result : "(no result)"}</JobStatus>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <Choose>
                                <When condition={status === "stopped"}>
                                    <Icon icon="stop" intent={Intent.NONE} />
                                </When>
                                <When condition={status === "running"}>
                                    <Icon icon="play" intent={Intent.PRIMARY} />
                                </When>
                                <When condition={status === "pending"}>
                                    <Icon icon="pause" intent={Intent.PRIMARY} />
                                </When>
                            </Choose>
                            <JobStatus>{status}</JobStatus>
                        </PaddedValue>
                    </JobDetailCell>
                </Row>
            </StyledCard>
        );
    }
}
