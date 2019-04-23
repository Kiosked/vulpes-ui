import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, FormGroup, Spinner } from "@blueprintjs/core";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";
import { startTimer, stopTimer } from "../library/timers.js";

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
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
        limit: 20
    };

    changeLimit(value) {
        this.props.onReady(value);
        this.setState({ limit: value });
    }

    componentDidMount() {
        this.props.onReady(this.state.limit);
        this.timer = startTimer(() => this.props.onReady(this.state.limit), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    render() {
        return (
            <Layout>
                <h1>Jobs</h1>
                <ControlsContainer>
                    <FormGroup label="Limit jobs">
                        <select
                            value={this.state.limit}
                            onChange={evt => this.changeLimit(evt.target.value)}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={Infinity}>No limit</option>
                        </select>
                    </FormGroup>
                </ControlsContainer>
                <VerticallySpacedButton
                    icon="add"
                    text="New job"
                    onClick={this.props.goToNewJobPage}
                />
                <Choose>
                    <When condition={this.props.jobs}>
                        <For each="job" of={this.props.jobs}>
                            <JobItem
                                job={job}
                                key={job.id}
                                onClick={() => this.props.goToJobPage(job.id)}
                            />
                        </For>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
