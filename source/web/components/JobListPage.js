import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Elevation, Button, Icon, Intent, Spinner } from "@blueprintjs/core";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";

const StyledButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default class HomePage extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        onReady: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.jobs}>
                    <Layout>
                        <StyledButton
                            icon="add"
                            text="New job"
                            onClick={this.props.goToNewJobPage}
                        />
                        <For each="job" of={this.props.jobs}>
                            <JobItem
                                job={job}
                                key={job.id}
                                onClick={() => this.props.goToJobPage(job.id)}
                            />
                        </For>
                    </Layout>
                </When>
                <Otherwise>
                    <Spinner />
                </Otherwise>
            </Choose>
        );
    }
}
