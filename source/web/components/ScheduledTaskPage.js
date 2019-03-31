import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button, ButtonGroup, Callout, Card, HTMLTable, Icon, Spinner } from "@blueprintjs/core";
import prettyCron from "prettycron";
import Layout from "./Layout";
import { ScheduledTaskShape } from "../library/propTypes.js";
import JobEditor from "./JobEditor.js";

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
const FullWidthTable = styled(HTMLTable)`
    width: 100%;
`;

export default class ScheduledTaskPage extends Component {
    static propTypes = {
        onAddJob: PropTypes.func.isRequired,
        onToggleTask: PropTypes.func.isRequired,
        task: ScheduledTaskShape,
        taskID: PropTypes.string.isRequired
    };

    state = {
        editingJob: null
    };

    addNewJob() {
        const nextID =
            this.props.task.jobs.length > 0
                ? Math.max(...this.props.task.jobs.map(job => job.id)) + 1
                : 1;
        this.setState({
            editingJob: {
                id: nextID
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
                        <If condition={this.state.editingJob}>
                            <Card>
                                <JobEditor
                                    canSetID
                                    job={this.state.editingJob}
                                    onSave={::this.saveNewJob}
                                    onCancel={() => this.setState({ editingJob: null })}
                                />
                            </Card>
                        </If>
                        <If condition={this.props.task}>
                            <FullWidthTable striped={true}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Parents</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <For each="job" of={this.props.task.jobs} index="jobIdx">
                                        <tr key={`job:${job.id || job.type || jobIdx}`}>
                                            <td>{job.id}</td>
                                            <td>{job.type}</td>
                                            <td>{(job.parents || []).join(", ")}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button icon="cross" small />
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    </For>
                                </tbody>
                            </FullWidthTable>
                        </If>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }

    saveNewJob(job) {
        this.props.onAddJob(this.props.taskID, job);
        this.setState({ editingJob: null });
    }
}
