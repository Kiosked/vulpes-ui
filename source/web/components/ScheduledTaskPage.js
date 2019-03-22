import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, Callout, HTMLTable, Spinner } from "@blueprintjs/core";
import prettyCron from "prettycron";
import Layout from "./Layout";
import { ScheduledTaskShape } from "../library/propTypes.js";

const TaskID = styled.pre`
    margin: 0;
`;
const Schedule = styled.pre`
    display: inline-block;
    margin: 0;
`;
const VerticallySpacedButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default class ScheduledTaskPage extends Component {
    static propTypes = {
        task: ScheduledTaskShape,
        taskID: PropTypes.string.isRequired
    };

    componentDidMount() {
        this.props.onReady(this.props.taskID);
    }

    componentDidUpdate(prevProps) {
        if (this.props.taskID !== prevProps.taskID) {
            this.props.onReady(this.props.taskID);
        }
    }

    render() {
        return (
            <Layout>
                <Choose>
                    <When condition={this.props.task}>
                        <Callout icon="calendar" title="Details">
                            <HTMLTable>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <td>
                                            <TaskID>{this.props.task.id}</TaskID>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Title</th>
                                        <td>{this.props.task.title}</td>
                                    </tr>
                                    <tr>
                                        <th>Schedule</th>
                                        <td>
                                            <Schedule>{this.props.task.schedule}</Schedule>&nbsp; (
                                            {prettyCron.toString(this.props.task.schedule)})
                                        </td>
                                    </tr>
                                </tbody>
                            </HTMLTable>
                        </Callout>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
                <VerticallySpacedButton icon="add" text="New scheduled job" onClick={() => {}} />
            </Layout>
        );
    }
}
