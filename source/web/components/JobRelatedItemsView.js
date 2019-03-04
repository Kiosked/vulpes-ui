import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";

export default class JobTreePage extends Component {
    static propTypes = {
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        onReady: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        return (
            <Fragment>
                <For each="job" of={this.props.jobs}>
                    <JobItem job={job} onClick={() => {}} />
                </For>
            </Fragment>
        );
    }
}
