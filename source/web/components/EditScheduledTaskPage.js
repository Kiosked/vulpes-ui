import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Classes, FormGroup, InputGroup, Intent, Button } from "@blueprintjs/core";
import cron from "node-cron";
import Layout from "./Layout.js";
import { ScheduledTaskShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";

const CRON_SCHEDULES = {
    "Every Minute": "* * * * *",
    "Every 15 minutes": "*/15 * * * *",
    "Every day at midnight": "0 0 * * *",
    "Twice daily": "0 */12 * * *",
    "Every weekday at 2am": "0 02 * * 1-5"
};

export default class EditScheduledTaskPage extends Component {
    static propTypes = {
        mode: PropTypes.oneOf(["create", "edit"]),
        onCreateTask: PropTypes.func.isRequired,
        onUpdateTask: PropTypes.func.isRequired,
        task: ScheduledTaskShape,
        taskID: PropTypes.string
    };

    state = {
        editedSchedule: false,
        editedTitle: false,
        loadedTask: false,
        schedule: "",
        title: ""
    };

    componentDidMount() {
        if (this.props.mode === "edit") {
            this.props.loadTask(this.props.taskID);
        }
    }

    componentDidUpdate() {
        if (this.props.mode === "edit" && this.state.loadedTask === false && this.props.task) {
            this.setState({
                title: this.props.task.title,
                schedule: this.props.task.schedule,
                loadedTask: true
            });
        }
    }

    get isValid() {
        return this.scheduleValid && this.titleValid;
    }

    get scheduleValid() {
        return cron.validate(this.state.schedule);
    }

    get titleValid() {
        return this.state.title.trim().length > 0;
    }

    render() {
        const scheduleIntentClass =
            !this.scheduleValid && this.state.editedSchedule ? Classes.INTENT_DANGER : "";
        return (
            <Layout>
                <Choose>
                    <When condition={this.props.mode === "create"}>
                        <h1>New Scheduled Task</h1>
                    </When>
                    <When condition={this.props.mode === "edit"}>
                        <h1>Edit Scheduled Task</h1>
                    </When>
                </Choose>
                <FormGroup label="Title" labelFor="title" labelInfo="(required)">
                    <InputGroup
                        type="text"
                        name="title"
                        value={this.state.title}
                        onChange={evt =>
                            this.setState({ title: evt.target.value, editedTitle: true })
                        }
                        intent={
                            !this.titleValid && this.state.editedTitle ? Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup label="Schedule" labelFor="schedule" labelInfo="(required)">
                    <div className={`${Classes.SELECT} select-editable ${Classes.FILL}`}>
                        <select
                            onChange={evt =>
                                this.setState({ schedule: evt.target.value, editedSchedule: true })
                            }
                            value={this.state.schedule}
                        >
                            <option value="">&nbsp;</option>
                            {/* Weird hack as first item is not selectable */}
                            <For each="scheduleName" of={Object.keys(CRON_SCHEDULES)}>
                                <option
                                    key={CRON_SCHEDULES[scheduleName]}
                                    value={CRON_SCHEDULES[scheduleName]}
                                >
                                    {`${scheduleName} (${CRON_SCHEDULES[scheduleName]})`}
                                </option>
                            </For>
                        </select>
                        <input
                            className={`${Classes.INPUT} ${scheduleIntentClass}`}
                            type="text"
                            name="schedule"
                            value={this.state.schedule}
                            onChange={evt =>
                                this.setState({ schedule: evt.target.value, editedSchedule: true })
                            }
                        />
                    </div>
                </FormGroup>
                <Button
                    icon="key-enter"
                    text="Save task"
                    onClick={::this.saveChanges}
                    disabled={!this.isValid}
                />
            </Layout>
        );
    }

    saveChanges() {
        if (this.props.mode === "create") {
            this.props.onCreateTask(this.state.title, this.state.schedule);
        } else if (this.props.mode === "edit") {
            this.props.onUpdateTask(this.props.taskID, this.state.title, this.state.schedule);
        }
    }
}
