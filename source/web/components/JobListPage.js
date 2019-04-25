import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Checkbox, FormGroup, Intent, Spinner } from "@blueprintjs/core";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";
import { startTimer, stopTimer } from "../library/timers.js";
import { sortJobs } from "vulpes/dist/jobSorting";
import VulpesSymbols from "vulpes/symbols.js";

const {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT,
    JOB_STATUS_PENDING,
    JOB_STATUS_RUNNING,
    JOB_STATUS_STOPPED
} = VulpesSymbols;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
`;

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const StyledFormGroup = styled(FormGroup)`
    margin-right: 30px;
`;

const VerticallySpacedButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default class JobListPage extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        onReady: PropTypes.func.isRequired
    };

    state = {
        limit: 10,
        sort: "created",
        order: "desc",
        visibleStatuses: []
    };

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    sortJobsByState() {
        if (this.props.jobs) {
            let jobs = sortJobs(this.props.jobs, [
                {
                    property: this.state.sort,
                    direction: this.state.order
                }
            ]);
            jobs = this.state.limit !== Infinity ? jobs.slice(0, this.state.limit) : jobs.slice(0);
            return jobs;
        }
    }

    render() {
        const visibleJobs = this.sortJobsByState();
        return (
            <Layout>
                <h1>Jobs</h1>
                <ControlsContainer>
                    <StyledFormGroup label="Limit jobs">
                        <select
                            value={this.state.limit}
                            onChange={evt => this.setState({ limit: evt.target.value, offset: 0 })}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </StyledFormGroup>
                    <StyledFormGroup label="Sort jobs">
                        <select
                            value={this.state.sort}
                            onChange={evt => this.setState({ sort: evt.target.value, offset: 0 })}
                        >
                            <option value="created">Creation date</option>
                            <option value="priority">Priority</option>
                            <option value="status">Status</option>
                            <option value="type">Job type</option>
                        </select>
                    </StyledFormGroup>
                    <StyledFormGroup label="Order">
                        <select
                            value={this.state.order}
                            onChange={evt => this.setState({ order: evt.target.value, offset: 0 })}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </StyledFormGroup>
                </ControlsContainer>
                <CheckboxContainer>
                    {/** 
                    <Checkbox
                        label="Show alerts"
                        inline={true}
                        onChange={event => this.onCheckboxValueChange(event, "alert")}
                        checked={this.state.visibleLevels.includes("alert")}
                    >
                    </Checkbox>
                    */}
                </CheckboxContainer>
                <VerticallySpacedButton
                    icon="add"
                    text="New job"
                    onClick={this.props.goToNewJobPage}
                />
                <Choose>
                    <When condition={this.props.jobs}>
                        <For each="job" of={visibleJobs}>
                            <JobItem
                                job={job}
                                key={job.id}
                                onClick={() => this.props.goToJobPage(job.id)}
                            />
                        </For>
                        <VerticallySpacedButton
                            icon="more"
                            text="Load more jobs"
                            intent={Intent.PRIMARY}
                            onClick={() =>
                                this.setState({ limit: parseInt(this.state.limit + 10) })
                            }
                        />
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
