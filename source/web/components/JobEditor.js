import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Button,
    ButtonGroup,
    Classes,
    ControlGroup,
    FormGroup,
    InputGroup,
    Intent,
    Tag
} from "@blueprintjs/core";
import nestedProperty from "nested-property";
import objectHash from "object-hash";
import ms from "ms";
import brace from "brace";
import AceEditor from "react-ace";
import Select from "react-select";
import { JobShape, JobShapeNew } from "../library/propTypes.js";
import {
    JOB_PRIORITY_HIGH,
    JOB_PRIORITY_LOW,
    JOB_PRIORITY_NORMAL,
    UUID_REXP
} from "vulpes/symbols";

import "brace/mode/json";
import "brace/theme/xcode";

function objectsDiffer(obj1, obj2) {
    const hash1 = objectHash(obj1);
    const hash2 = objectHash(obj2);
    return hash1 !== hash2;
}

const TEMPLATE_JOB_ID_REXP = /^\d+$/;

export default class JobEditor extends Component {
    static defaultProps = {
        canSetID: false,
        isTemplate: false,
        jobTypes: []
    };

    static propTypes = {
        canSetID: PropTypes.bool.isRequired,
        isTemplate: PropTypes.bool.isRequired,
        job: PropTypes.oneOfType([JobShape, JobShapeNew]),
        jobTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
        onCancel: PropTypes.func,
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
        if (this.props.canSetID && !/^\d+$/.test(this.state.jobID)) {
            invalidItems.push("id");
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
        if (!objectsDiffer(job, this.state.offlineTemplate)) {
            return;
        }
        this.setState({
            jobData: job.data ? JSON.stringify(job.data, undefined, 2) : "{}",
            jobID: job.id || null,
            jobMaxAttempts: nestedProperty.get(job, "predicate.attemptsMax") || null,
            jobParents: Array.isArray(job.parents) ? [...job.parents] : [],
            jobPriority: job.priority || null,
            jobTimeLimit: job.timeLimit || null,
            jobType: job.type || "",
            offlineTemplate: JSON.parse(JSON.stringify(job))
        });
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
                <If condition={this.props.canSetID}>
                    <FormGroup label="ID" labelFor="id" labelInfo="(Job placeholder ID - eg. '1')">
                        <InputGroup
                            type="text"
                            id="id"
                            value={this.state.jobID === null ? "" : this.state.jobID}
                            onChange={evt =>
                                this.setState({
                                    jobID: evt.target.value.trim() ? evt.target.value.trim() : null
                                })
                            }
                            intent={this.invalidItems.includes("id") ? Intent.DANGER : Intent.NONE}
                        />
                    </FormGroup>
                </If>
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
                            disabled={
                                this.props.isTemplate
                                    ? !TEMPLATE_JOB_ID_REXP.test(this.state.newParent)
                                    : !UUID_REXP.test(this.state.newParent)
                            }
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
                <ButtonGroup>
                    <Button
                        icon="document-share"
                        text="Save job"
                        onClick={::this.saveJob}
                        disabled={this.invalidItems.length > 0}
                    />
                    <If condition={typeof this.props.onCancel === "function"}>
                        <Button icon="delete" text="Cancel" onClick={::this.props.onCancel} />
                    </If>
                </ButtonGroup>
            </>
        );
    }

    saveJob() {
        this.props.onSave(this.prepareOutgoingJob());
    }
}
