import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Callout, HTMLTable, Icon, Spinner } from "@blueprintjs/core";
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
        onToggleTask: PropTypes.func.isRequired,
        task: ScheduledTaskShape,
        taskID: PropTypes.string.isRequired
    };

    state = {
        editingJob: null
    };

    addNewJob() {
        const nextID = Math.max(...this.props.task.jobs.map(job => job.id)) + 1;
        this.setState({
            editingJob: {
                id: nextID,
                type: "",
                data: {}
            }
        });
    }

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
                <h1>Scheduled Task</h1>
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
                                    <tr>
                                        <th>Status</th>
                                        <td>
                                            <Choose>
                                                <When condition={this.props.task.enabled}>
                                                    <Icon icon="play" />
                                                    &nbsp; Enabled
                                                </When>
                                                <Otherwise>
                                                    <Icon icon="stop" />
                                                    &nbsp; Disabled
                                                </Otherwise>
                                            </Choose>
                                        </td>
                                    </tr>
                                </tbody>
                            </HTMLTable>
                        </Callout>
                        <ButtonGroup>
                            <VerticallySpacedButton
                                icon="add"
                                text="New scheduled job"
                                onClick={::this.addNewJob}
                                disabled={!!this.state.editingJob}
                            />
                            <VerticallySpacedButton
                                icon={this.props.task.enabled ? "stop" : "play"}
                                text={this.props.task.enabled ? "Disable Task" : "Enable Task"}
                                onClick={() =>
                                    this.props.onToggleTask(
                                        this.props.task.id,
                                        !this.props.task.enabled
                                    )
                                }
                                disabled={!!this.state.editingJob}
                            />
                        </ButtonGroup>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
