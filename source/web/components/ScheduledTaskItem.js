import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Elevation, Button, Icon, Intent, Spinner } from "@blueprintjs/core";
import prettyCron from "prettycron";
import { ScheduledTaskShape } from "../library/propTypes.js";

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
    font-family: monospace;
`;
const ExpectedRunTime = styled.span`
    color: #666;
    font-size: 12px;
`;
const Row = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;
const JobTopRow = styled(Row)`
    justify-content: space-between;
    border-bottom: 1px solid #eee;
`;
const JobDetailCell = styled.div`
    border-left: 1px solid #eee;
`;

export default class ScheduledTaskItem extends Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        task: ScheduledTaskShape.isRequired
    };

    render() {
        const { task } = this.props;
        return (
            <StyledCard
                interactive={true}
                elevation={Elevation.TWO}
                key={task.id}
                onClick={() => this.props.onClick()}
                background={task.enabled ? "rgba(0,255,0,0.03)" : "rgba(0,0,0,0.03)"}
            >
                <JobTopRow>
                    <PaddedValue>
                        <JobID>{task.id}</JobID>
                    </PaddedValue>
                    <PaddedValue>
                        <JobType>{task.title}</JobType>
                    </PaddedValue>
                </JobTopRow>
                <Row>
                    <JobDetailCell>
                        <PaddedValue>
                            <JobCreatedDate>{task.schedule}</JobCreatedDate>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <ExpectedRunTime>{prettyCron.toString(task.schedule)}</ExpectedRunTime>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <Icon color="rgba(0,0,0,0.5)" iconSize={12} icon="cube" />
                            &nbsp;&nbsp;
                            <span>{task.jobs.length}</span>
                        </PaddedValue>
                    </JobDetailCell>
                    <JobDetailCell>
                        <PaddedValue>
                            <Choose>
                                <When condition={task.enabled}>
                                    <Icon icon="play" intent={Intent.PRIMARY} />
                                </When>
                                <Otherwise>
                                    <Icon icon="stop" intent={Intent.NONE} />
                                </Otherwise>
                            </Choose>
                            <JobStatus>{task.enabled ? "Enabled" : "Disabled"}</JobStatus>
                        </PaddedValue>
                    </JobDetailCell>
                </Row>
            </StyledCard>
        );
    }
}
