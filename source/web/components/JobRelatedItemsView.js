import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Spinner } from "@blueprintjs/core";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";

export default class JobRelatedItemsView extends Component {
    static defaultProps = {
        show: "all"
    };

    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        job: JobShape.isRequired,
        jobTree: PropTypes.arrayOf(JobShape),
        show: PropTypes.string.isRequired
    };

    render() {
        const canShow = targetJob =>
            this.props.show === "all" ||
            (this.props.show === "parents" && this.props.job.parents.includes(targetJob.id)) ||
            (this.props.show === "children" && targetJob.parents.includes(this.props.job.id));
        return (
            <Fragment>
                <Choose>
                    <When condition={this.props.jobTree}>
                        <For each="job" of={this.props.jobTree}>
                            <If condition={canShow(job)}>
                                <JobItem
                                    job={job}
                                    onClick={() => this.props.goToJobPage(job.id)}
                                    key={job.id}
                                />
                            </If>
                        </For>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Fragment>
        );
    }
}
