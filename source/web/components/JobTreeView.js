import React, { Component } from "react";
import { ReactCytoscape } from "react-cytoscape";
import { Spinner } from "@blueprintjs/core";
import PropTypes from "prop-types";
import styled from "styled-components";
import Modal from "./Modal";
import { JobShape } from "../library/propTypes.js";

function shortID(id) {
    return `${id.split("-")[0]}…`;
}

export default class JobTreeView extends Component {
    static propTypes = {
        job: JobShape,
        jobID: PropTypes.string.isRequired,
        jobTree: PropTypes.arrayOf(JobShape)
    };

    state = {
        showModal: false,
        modalData: {}
    };

    getElements() {
        const tree = [...this.props.jobTree].reverse();
        const nodes = [];
        const edges = [];
        if (tree) {
            tree.forEach((job, index) => {
                let status = job.result.type ? job.result.type.replace("job/result/", "") : "";
                let statusColor;
                switch (status) {
                    case "success":
                        statusColor = "#228B22";
                        break;
                    case "fail/timeout":
                        statusColor = "#DC143C";
                        break;
                    case "fail":
                        statusColor = "#DC143C";
                        break;
                    case "fail/soft":
                        statusColor = "#DC143C";
                        break;
                    default:
                        statusColor = "#11479e";
                }
                const node = {
                    data: {
                        id: shortID(job.id),
                        jobParents: job.parents,
                        jobData: {
                            id: job.id,
                            type: job.type,
                            status: job.status,
                            priority: job.priority
                        }
                    },
                    style: {
                        "background-color": statusColor,
                        shape: this.props.jobID === job.id ? "rectangle" : "ellipse",
                        "border-width": "3px",
                        "border-opacity": this.props.jobID === job.id ? "0.7" : "0",
                        color:
                            job.status.replace("job/status/", "") === "running" ? "white" : "black",
                        "font-size": "10px"
                    },
                    selected: this.props.jobID === job.id ? true : false
                };
                nodes.push(node);
            });
            tree.forEach(job => {
                if (job.parents.length > 0) {
                    job.parents.forEach(parent => {
                        const targetNode = nodes.find(node => node.data.jobData.id === job.id);
                        const sourceNode = nodes.find(node => node.data.jobData.id === parent);
                        if (!targetNode || !sourceNode) {
                            return;
                        }
                        edges.push({
                            data: {
                                source: sourceNode.data.id,
                                target: targetNode.data.id
                            }
                        });
                    });
                }
            });
        }
        const elements = { nodes, edges };
        return elements;
    }

    render() {
        return (
            <Choose>
                <When condition={this.props.jobTree && this.props.job}>
                    <ReactCytoscape
                        containerID="cy"
                        elements={this.getElements()}
                        cyRef={cy => {
                            this.cyRef(cy);
                        }}
                        cytoscapeOptions={{ wheelSensitivity: 0.1 }}
                        layout={{ name: "dagre" }}
                    />
                    <If condition={this.state.showModal}>
                        <Modal
                            data={this.state.modalData}
                            onClose={this.toggleModal.bind(this)}
                            goToJobPage={this.props.goToJobPage}
                        />
                    </If>
                </When>
                <Otherwise>
                    <Spinner />
                </Otherwise>
            </Choose>
        );
    }

    cyRef(cy) {
        this.cy = cy;
        const self = this;
        cy.on("tap", "node", function(evt) {
            const node = evt.target;
            const jobData = node._private.data.jobData;
            self.setState({ modalData: jobData });
            self.toggleModal();
        });
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
}
