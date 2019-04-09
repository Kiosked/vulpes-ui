import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormGroup, InputGroup, ControlGroup, Button } from "@blueprintjs/core";
import styled from "styled-components";
import Layout from "./Layout.js";
import JobEditor from "./JobEditor.js";

const DEFAULT_PRIORITY = 0;

const ParentsInput = styled(InputGroup)`
    width: 90%;
`;

export default class JobCreationPage extends Component {
    static propTypes = {
        initialParent: PropTypes.string,
        jobTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
        onReady: PropTypes.func.isRequired
    };

    componentDidMount() {
        this.props.onReady();
    }

    render() {
        return (
            <Layout>
                <JobEditor
                    parents={this.props.initialParent ? [this.props.initialParent] : []}
                    jobTypes={this.props.jobTypes}
                    onSave={job => this.props.addNewJob(job)}
                />
            </Layout>
        );
    }
}
