import React, { Component } from "react";
import styled from "styled-components";
import { JOB_STATUS_PENDING, JOB_STATUS_RUNNING, JOB_STATUS_STOPPED } from "vulpes/symbols";

const JobDL = styled.dl`
    > dt {
        font-weight: bold;
        font-size: 14px;
    }
    > dd {
        margin-left: 50px;
    }
`;

const JOB_STATUS_MAP = {
    [JOB_STATUS_PENDING]: "Pending",
    [JOB_STATUS_RUNNING]: "Running",
    [JOB_STATUS_STOPPED]: "Stopped"
};

export default class JobPreviewModal extends Component {
    componentDidMount() {
        this.props.onReady(this.props.jobID);
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.job}>
                    <JobDL>
                        <dt>ID</dt>
                        <dd>{this.props.jobID}</dd>
                        <dt>Type</dt>
                        <dd>{this.props.job.type}</dd>
                        <dt>Status</dt>
                        <dd>{JOB_STATUS_MAP[this.props.job.status]}</dd>
                    </JobDL>
                </When>
            </Choose>
        );
    }
}
