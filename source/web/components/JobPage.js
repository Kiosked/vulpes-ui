import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Layout from "./Layout";
import { JobShape } from "../library/propTypes.js";
import JobView from "./JobView.js";
import JobTreeView from "./JobTreeView.js";
import JobRelatedItemsView from "../containers/JobRelatedItemsView.js";

const CustomTabList = styled.ul`
    list-style-type: none;
    width: 100%;
`;
const CustomTab = styled.li`
    display: inline;
    border-bottom: ${props => (props.selected ? "2px solid #219bb6" : "none")};
    margin-right: 15px;
    cursor: pointer;
    &:hover {
        border-bottom: 2px solid #fc9732;
    }
    user-select: none;
`;

export default class JobPage extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        goToNewDependentJobPage: PropTypes.func.isRequired,
        goToNewJobPage: PropTypes.func.isRequired,
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        jobTree: PropTypes.arrayOf(JobShape),
        onReady: PropTypes.func.isRequired,
        resetJob: PropTypes.func.isRequired,
        stopJob: PropTypes.func.isRequired,
        updateJob: PropTypes.func.isRequired
    };

    state = {
        tab: "job"
    };

    componentDidMount() {
        this.props.onReady(this.props.jobID);
    }

    componentDidUpdate(prevProps) {
        if (this.props.jobID !== prevProps.jobID) {
            this.props.onReady(this.props.jobID);
        }
    }

    goToJobPage(jobID) {
        this.setState(
            {
                tab: "job"
            },
            () => {
                this.props.goToJobPage(jobID);
            }
        );
    }

    render() {
        return (
            <Layout>
                <CustomTabList>
                    <CustomTab
                        selected={this.state.tab === "job"}
                        onClick={() => this.setState({ tab: "job" })}
                    >
                        Job details
                    </CustomTab>
                    <CustomTab
                        selected={this.state.tab === "tree"}
                        onClick={() => this.setState({ tab: "tree" })}
                    >
                        Job tree
                    </CustomTab>
                    <CustomTab
                        selected={this.state.tab === "parents"}
                        onClick={() => this.setState({ tab: "parents" })}
                    >
                        Parent Jobs
                    </CustomTab>
                    <CustomTab
                        selected={this.state.tab === "children"}
                        onClick={() => this.setState({ tab: "children" })}
                    >
                        Child Jobs
                    </CustomTab>
                </CustomTabList>
                <Choose>
                    <When condition={this.state.tab === "job"}>
                        <JobView
                            goToNewDependentJobPage={this.props.goToNewDependentJobPage}
                            goToNewJobPage={this.props.goToNewJobPage}
                            job={this.props.job}
                            jobID={this.props.jobID}
                            resetJob={this.props.resetJob}
                            stopJob={this.props.stopJob}
                            updateJob={this.props.updateJob}
                        />
                    </When>
                    <When condition={this.state.tab === "tree"}>
                        <JobTreeView
                            goToJobPage={::this.goToJobPage}
                            job={this.props.job}
                            jobID={this.props.jobID}
                            jobTree={this.props.jobTree}
                        />
                    </When>
                    <When condition={this.state.tab === "parents"}>
                        <JobRelatedItemsView
                            goToJobPage={::this.goToJobPage}
                            job={this.props.job}
                            show="parents"
                        />
                    </When>
                    <When condition={this.state.tab === "children"}>
                        <JobRelatedItemsView
                            goToJobPage={::this.goToJobPage}
                            job={this.props.job}
                            show="children"
                        />
                    </When>
                </Choose>
            </Layout>
        );
    }
}
