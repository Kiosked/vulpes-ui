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

const { JOB_STATUS_PENDING, JOB_STATUS_RUNNING, JOB_STATUS_STOPPED } = VulpesSymbols;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
`;

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
`;

const PaginationButton = styled(Button)`
    margin-left: 10px;
`;

const PaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 25px;
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
        offset: 0,
        sort: "created",
        order: "desc",
        visibleStatuses: [JOB_STATUS_PENDING, JOB_STATUS_RUNNING, JOB_STATUS_STOPPED]
    };

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    setFilters(e, value, filter) {
        const arr = this.state[filter];
        if (e.target.checked) {
            if (!arr.includes(value)) {
                arr.push(value);
            }
        } else {
            if (arr.indexOf(value) !== -1) {
                arr.splice(arr.indexOf(value), 1);
            }
        }
        this.setState({ [filter]: arr });
    }

    sortJobsByState() {
        const start = this.state.offset;
        const end = parseInt(this.state.limit + this.state.offset);
        if (this.props.jobs) {
            let jobs = sortJobs(this.props.jobs, [
                {
                    property: this.state.sort,
                    direction: this.state.order
                }
            ]);
            jobs = this.props.filterByStatus(jobs, this.state.visibleStatuses);
            jobs = this.state.limit !== Infinity ? jobs.slice(start, end) : jobs.slice(start);
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
                            onChange={evt => this.setState({ limit: parseInt(evt.target.value) })}
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
                            onChange={evt => this.setState({ sort: evt.target.value })}
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
                            onChange={evt => this.setState({ order: evt.target.value })}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </StyledFormGroup>
                </ControlsContainer>
                <CheckboxContainer>
                    <Checkbox
                        label="Show pending jobs"
                        inline={true}
                        onChange={evt =>
                            this.setFilters(evt, JOB_STATUS_PENDING, "visibleStatuses")
                        }
                        checked={this.state.visibleStatuses.includes(JOB_STATUS_PENDING)}
                    />
                    <Checkbox
                        label="Show running jobs"
                        inline={true}
                        onChange={evt =>
                            this.setFilters(evt, JOB_STATUS_RUNNING, "visibleStatuses")
                        }
                        checked={this.state.visibleStatuses.includes(JOB_STATUS_RUNNING)}
                    />
                    <Checkbox
                        label="Show stopped jobs"
                        inline={true}
                        onChange={evt =>
                            this.setFilters(evt, JOB_STATUS_STOPPED, "visibleStatuses")
                        }
                        checked={this.state.visibleStatuses.includes(JOB_STATUS_STOPPED)}
                    />
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
                        <PaginationContainer>
                            <div>
                                Showing {visibleJobs.length} jobs out of {this.props.jobs.length}
                            </div>
                            <div>
                                <If condition={this.state.offset > 0}>
                                    <PaginationButton
                                        icon="direction-left"
                                        text="Previous page"
                                        intent={Intent.PRIMARY}
                                        onClick={() =>
                                            this.setState({
                                                offset: parseInt(
                                                    this.state.offset - this.state.limit
                                                )
                                            })
                                        }
                                    />
                                </If>
                                <If condition={visibleJobs.length === this.state.limit}>
                                    <PaginationButton
                                        icon="direction-right"
                                        text="Next page"
                                        intent={Intent.PRIMARY}
                                        onClick={() =>
                                            this.setState({
                                                offset: parseInt(
                                                    this.state.offset + this.state.limit
                                                )
                                            })
                                        }
                                    />
                                </If>
                            </div>
                        </PaginationContainer>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
