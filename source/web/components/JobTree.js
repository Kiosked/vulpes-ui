import React, { Component } from "react";
import { ReactCytoscape } from "react-cytoscape";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { fetchJobTree } from "../library/app";
import Layout from "./Layout";
import Modal from "./Modal";

const CustomTabList = styled.ul`
    list-style-type: none;
    width: 100%;
`;

const CustomTab = styled.li`
    display: inline;
    border-bottom: 5px solid #219bb6;
    margin-right: 15px;
    cursor: pointer;
`;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: [],
            showModal: false,
            modalData: {}
        };
    }

    componentDidMount() {
        const jobId = this.props.jobId;
        fetchJobTree(jobId)
            .then(res => {
                this.setState({ tree: res });
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }

    getElements() {
        const jobId = this.props.jobId;
        const tree = this.state.tree;
        let nodes = [];
        let edges = [];
        if (tree) {
            tree.map((job, index) => {
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
                let node = {
                    data: {
                        id: index,
                        jobParents: job.parents,
                        jobData: {
                            id: job.id,
                            type: job.type,
                            status: job.status.replace("job/status/", ""),
                            priority: job.priority
                        }
                    },
                    style: {
                        "background-color": statusColor,
                        shape: jobId === job.id ? "rectangle" : "ellipse",
                        "border-width": "3px",
                        "border-opacity": jobId === job.id ? "0.7" : "0",
                        color:
                            job.status.replace("job/status/", "") === "running" ? "white" : "black"
                    },
                    selected: jobId === job.id ? true : false
                };
                nodes.push(node);
            });
            tree.map(job => {
                if (job.parents.length > 0) {
                    job.parents.map(parent => {
                        let targetNode = nodes.find(node => node.data.jobData.id === job.id);
                        let sourceNode = nodes.find(node => node.data.jobData.id === parent);
                        let edge = {
                            data: {
                                source: sourceNode.data.id,
                                target: targetNode.data.id
                            }
                        };
                        edges.push(edge);
                    });
                }
            });
        }
        const elements = { nodes, edges };
        return elements;
    }

    render() {
        return (
            <Layout>
                <CustomTabList>
                    <CustomTab onClick={() => this.props.goToJobPage(this.props.jobId)}>
                        Job details
                    </CustomTab>
                    <CustomTab onClick={() => this.props.goToJobTreePage(this.props.jobId)}>
                        Job tree
                    </CustomTab>
                </CustomTabList>
                <Choose>
                    <When condition={this.state.tree}>
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
                        <Loader type="Puff" color="#00BFFF" height="100" width="100" />
                    </Otherwise>
                </Choose>
            </Layout>
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
