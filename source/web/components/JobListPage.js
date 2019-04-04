import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Elevation, Button, Icon, Intent, Spinner } from "@blueprintjs/core";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";
import { startTimer, stopTimer } from "../library/timers.js";

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

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    render() {
        return (
            <Layout>
                <h1>Jobs</h1>
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
