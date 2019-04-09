import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import { Button, Classes, Colors, Dialog, Intent, Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import objectHash from "object-hash";
import styled from "styled-components";
import {
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_SUCCESS,
    JOB_RESULT_TYPE_TIMEOUT,
    JOB_STATUS_PENDING,
    JOB_STATUS_RUNNING,
    JOB_STATUS_STOPPED
} from "vulpes/symbols";
import { JobShape } from "../library/propTypes.js";

const FAILED_TYPES = [
    JOB_RESULT_TYPE_FAILURE,
    JOB_RESULT_TYPE_FAILURE_SOFT,
    JOB_RESULT_TYPE_TIMEOUT
];
const JOB_STATUS_MAP = {
    [JOB_STATUS_PENDING]: "Pending",
    [JOB_STATUS_RUNNING]: "Running",
    [JOB_STATUS_STOPPED]: "Stopped"
};

const JobDialog = styled(Dialog)`
    min-width: 520px;
`;
const JobDL = styled.dl`
    > dt {
        font-weight: bold;
        font-size: 14px;
    }
    > dd {
        margin-left: 50px;
    }
`;

function getFriendlyStatus(job) {
    if (job.status === JOB_STATUS_RUNNING) {
        return "running";
    } else if (job.status === JOB_STATUS_PENDING) {
        return "pending";
    } else if (job.status === JOB_STATUS_STOPPED) {
        if (FAILED_TYPES.includes(job.result.type)) {
            return "failed";
        } else if (job.result.type === JOB_RESULT_TYPE_SUCCESS) {
            return "succeeded";
        }
    }
    return "unknown";
}

function getNodeColour(node) {
    switch (node.status) {
        case "running":
            return Colors.COBALT4;
        case "failed":
            return Colors.VERMILION4;
        case "succeeded":
            return Colors.FOREST4;
        case "pending":
            return Colors.GOLD4;
        default:
            return Colors.GRAY4;
    }
}

function objectsDiffer(obj1, obj2) {
    const hash1 = objectHash(obj1);
    const hash2 = objectHash(obj2);
    return hash1 !== hash2;
}

function shortID(id) {
    return `${id.split("-")[0]}…`;
}

export default class JobTreeView extends Component {
    static propTypes = {
        goToJobPage: PropTypes.func.isRequired,
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        jobTree: PropTypes.arrayOf(JobShape)
    };

    state = {
        jobTree: [],
        links: [],
        modalData: {},
        nodes: [],
        selectedJob: null
    };

    componentDidMount() {
        this.updateJobTree(this.props.jobTree);
        // Hack to get animation working on link particles
        setTimeout(() => {
            this.setState({});
        }, 5);
    }

    componentDidUpdate() {
        this.updateJobTree(this.props.jobTree);
    }

    handleNodeClicked(node) {
        const job = this.state.jobTree.find(job => job.id === node.id);
        this.setState({
            selectedJob: job
        });
    }

    render() {
        return (
            <>
                <Choose>
                    <When condition={this.state.jobTree}>
                        <ForceGraph2D
                            backgroundColor="#FFF"
                            graphData={{
                                nodes: this.state.nodes,
                                links: this.state.links
                            }}
                            linkDirectionalArrowLength={6}
                            linkDirectionalParticles={link =>
                                link.target.status === "running" ? 2 : 0
                            }
                            nodeColor={getNodeColour}
                            nodeLabel={node => node.id || "?"}
                            nodeVal={node => (node.id === this.props.jobID ? 2 : 1)}
                            onNodeClick={::this.handleNodeClicked}
                            width={800}
                            height={600}
                        />
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
                <JobDialog
                    icon="flow-review-branch"
                    isOpen={!!this.state.selectedJob}
                    title={
                        this.state.selectedJob
                            ? `${this.state.selectedJob.type} (${this.state.selectedJob.id})`
                            : ""
                    }
                >
                    <div className={Classes.DIALOG_BODY}>
                        <If condition={this.state.selectedJob}>
                            <JobDL>
                                <dt>ID</dt>
                                <dd>{this.state.selectedJob.id}</dd>
                                <dt>Type</dt>
                                <dd>{this.state.selectedJob.type}</dd>
                                <dt>Status</dt>
                                <dd>{JOB_STATUS_MAP[this.state.selectedJob.status]}</dd>
                            </JobDL>
                        </If>
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => this.props.goToJobPage(this.state.selectedJob.id)}
                                intent={Intent.PRIMARY}
                            >
                                Open
                            </Button>
                            <Button onClick={() => this.setState({ selectedJob: null })}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </JobDialog>
            </>
        );
    }

    updateJobTree(tree) {
        if (!tree || !objectsDiffer(tree, this.state.jobTree)) {
            return;
        }
        const jobTree = JSON.parse(JSON.stringify(tree));
        this.setState({
            jobTree,
            nodes: jobTree.map(job => ({
                id: job.id,
                type: job.type,
                status: getFriendlyStatus(job)
            })),
            links: jobTree.reduce((links, job) => {
                job.parents.forEach(parentID => {
                    if (jobTree.find(searchJob => searchJob.id === parentID)) {
                        links.push({
                            source: parentID,
                            target: job.id
                        });
                    }
                });
                return links;
            }, [])
        });
    }
}
