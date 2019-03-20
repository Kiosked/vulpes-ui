import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "@blueprintjs/core";
import Layout from "./Layout";

const VerticallySpacedButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default class SchedulingPage extends Component {
    static propTypes = {
        goToNewScheduledTask: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired
    };

    state = {};

    componentDidMount() {
        this.props.onReady(this.props.jobID);
    }

    render() {
        return (
            <Layout>
                <VerticallySpacedButton
                    icon="add"
                    text="New scheduled task"
                    onClick={this.props.goToNewScheduledTask}
                />
            </Layout>
        );
    }
}
