import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Button,
    Classes,
    ControlGroup,
    FormGroup,
    InputGroup,
    Intent,
    Tag
} from "@blueprintjs/core";
import objectHash from "object-hash";
import ms from "ms";
import brace from "brace";
import AceEditor from "react-ace";
import Select from "react-select";
import { JobShape } from "../library/propTypes.js";
import {
    JOB_PRIORITY_HIGH,
    JOB_PRIORITY_LOW,
    JOB_PRIORITY_NORMAL,
    UUID_REXP
} from "vulpes/symbols";

import "brace/mode/json";
import "brace/theme/xcode";

function dataObjectsDiffer(obj1, obj2) {
    const hash1 = objectHash(obj1);
    const hash2 = objectHash(obj2);
    return hash1 !== hash2;
}

export default class JobEditor extends Component {
    static defaultProps = {
        jobTypes: []
    };

    static propTypes = {
        job: JobShape,
        jobTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
        onSave: PropTypes.func.isRequired
    };

    state = {
        editedJobType: false,
        jobData: "{}",
        jobID: null,
        jobMaxAttempts: null,
        jobParents: [],
        jobPriority: JOB_PRIORITY_NORMAL,
        jobTimeLimit: null,
        jobType: "",
        newParent: "",
        offlineTemplate: {}
    };

    get invalidItems() {
        const invalidItems = [];
        try {
            JSON.parse(this.state.jobData);
        } catch (e) {
            invalidItems.push("data");
        }
        if (this.state.jobType.trim().length <= 0) {
            invalidItems.push("type");
        }
        if (this.state.jobMaxAttempts !== null && typeof this.state.jobMaxAttempts !== "number") {
            invalidItems.push("attemptsMax");
        }
        if (this.state.jobTimeLimit !== null && typeof this.state.jobTimeLimit !== "number") {
            invalidItems.push("timeLimit");
        }
        return invalidItems;
    }

    get jobTimeLimitAsNumber() {
        return this.state.jobTimeLimit !== null ? parseInt(this.state.jobTimeLimit, 0) : 0;
    }

    addNewParent() {
        const parents = [...this.state.jobParents, this.state.newParent];
        this.setState({
            jobParents: parents,
            newParent: ""
        });
    }

    componentDidMount() {
        if (this.props.job) {
            this.processUpdatedJob(this.props.job);
        }
    }

    componentDidUpdate() {
        if (this.props.job) {
            this.processUpdatedJob(this.props.job);
        }
    }

    prepareOutgoingJob() {
        return {
            ...this.state.offlineTemplate,
            id: this.state.jobID,
            type: this.state.jobType,
            data: JSON.parse(this.state.jobData),
            parents: [...this.state.jobParents],
            priority: this.state.jobPriority,
            predicate: {
                ...(this.state.offlineTemplate.predicate || {}),
                attemptsMax: this.state.jobMaxAttempts
            },
            timeLimit: this.state.jobTimeLimit
        };
    }

    processUpdatedJob(job) {
        const newState = {};
        if (job.data && dataObjectsDiffer(job.data, JSON.parse(this.state.jobData))) {
            newState.data = JSON.stringify(job.data, undefined, 2);
        }
        if (job.id && this.state.jobID !== job.id) {
            newState.jobID = job.id;
        }
        if (job.predicate) {
            if (
                typeof job.predicate.attemptsMax !== "undefined" &&
                job.predicate.attemptsMax !== this.state.jobMaxAttempts
            ) {
                newState.jobMaxAttempts = job.predicate.attemptsMax;
            }
        }
        if (Array.isArray(job.parents)) {
            newState.jobParents = [...job.parents];
        }
        if (job.priority !== this.state.jobPriority) {
            newState.jobPriority = job.priority;
        }
        if (typeof job.timeLimit !== "undefined" && job.timeLimit !== this.state.jobTimeLimit) {
            newState.jobTimeLimit = job.timeLimit;
        }
        if (job.type && job.type !== this.state.jobType) {
            newState.jobType = job.type;
        }
        if (Object.keys(newState).length > 0) {
            newState.offlineTemplate = JSON.parse(JSON.stringify(job));
            this.setState(newState);
        }
    }

    render() {
        const priorityOptions = [
            { value: JOB_PRIORITY_NORMAL, label: "Normal" },
            { value: JOB_PRIORITY_LOW, label: "Low" },
            { value: JOB_PRIORITY_HIGH, label: "High" }
        ];
        const selectedPriorityOption = priorityOptions.find(
            opt => opt.value === this.state.jobPriority
        );
        const typeIntentClass =
            this.invalidItems.includes("type") && this.state.editedJobType
                ? Classes.INTENT_DANGER
                : "";
        return (
            <>
                <FormGroup label="Type" labelFor="type" labelInfo="(required)">
                    <div className={`${Classes.SELECT} select-editable ${Classes.FILL}`}>
                        <select
                            onChange={evt =>
                                this.setState({ editedJobType: true, jobType: evt.target.value })
                            }
                            value={this.state.type}
                        >
                            <For each="type" index="idx" of={this.props.jobTypes}>
                                <option key={idx} value={type}>
                                    {type}
                                </option>
                            </For>
                        </select>
                        <input
                            className={`${Classes.INPUT} ${typeIntentClass}`}
                            type="text"
                            name="type"
                            value={this.state.jobType}
                            onChange={evt =>
                                this.setState({ editedJobType: true, jobType: evt.target.value })
                            }
                        />
                    </div>
                </FormGroup>
                <FormGroup label="Priority" labelFor="priority">
                    <Select
                        options={priorityOptions}
                        id="priority"
                        onChange={item => this.setState({ jobType: item.value })}
                        value={selectedPriorityOption}
                    />
                </FormGroup>
                <FormGroup
                    label="Parents"
                    labelFor="parents"
                    helperText={this.state.jobParents.join(", ")}
                >
                    <ControlGroup>
                        <InputGroup
                            type="text"
                            id="parents"
                            value={this.state.newParent}
                            onChange={evt => this.setState({ newParent: evt.target.value })}
                        />
                        <Button
                            icon="add"
                            onClick={::this.addNewParent}
                            disabled={!UUID_REXP.test(this.state.newParent)}
                        />
                    </ControlGroup>
                </FormGroup>
                <FormGroup
                    label="Time limit"
                    labelInfo="(milliseconds, 0 = unlimited)"
                    labelFor="timelimit"
                >
                    <InputGroup
                        type="number"
                        id="timelimit"
                        value={this.jobTimeLimitAsNumber}
                        onChange={evt =>
                            this.setState({
                                jobTimeLimit:
                                    evt.target.value === 0 ? null : parseInt(evt.target.value, 10)
                            })
                        }
                        min="0"
                        step="1000"
                        rightElement={
                            this.jobTimeLimitAsNumber > 0 ? (
                                <Tag>~ {ms(this.jobTimeLimitAsNumber, { long: true })}</Tag>
                            ) : (
                                <Tag>Unlimited</Tag>
                            )
                        }
                        intent={
                            this.invalidItems.includes("timeLimit") ? Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup label="Max. attempts" labelFor="attemptsMax" labelInfo="(0 = unlimited)">
                    <InputGroup
                        type="number"
                        id="attemptsMax"
                        value={this.state.jobMaxAttempts === null ? 0 : this.state.jobMaxAttempts}
                        onChange={evt =>
                            this.setState({
                                jobMaxAttempts:
                                    evt.target.value === 0 ? null : parseInt(evt.target.value, 10)
                            })
                        }
                        min="0"
                        step="1"
                        intent={
                            this.invalidItems.includes("attemptsMax") ? Intent.DANGER : Intent.NONE
                        }
                    />
                </FormGroup>
                <FormGroup label="Data" labelFor="data">
                    <AceEditor
                        mode="json"
                        id="data"
                        theme="xcode"
                        height="200px"
                        onChange={data =>
                            this.setState({
                                jobData: data
                            })
                        }
                        value={this.state.jobData}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        editorProps={{ $blockScrolling: Infinity }}
                    />
                </FormGroup>
                <Button
                    icon="key-enter"
                    text="Save job"
                    onClick={::this.saveJob}
                    disabled={this.invalidItems.length > 0}
                />
            </>
        );
    }

    saveJob() {
        this.props.onSave(this.prepareOutgoingJob());
    }
}
