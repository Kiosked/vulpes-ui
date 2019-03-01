import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormGroup, InputGroup, ControlGroup, Button } from "@blueprintjs/core";
import Select from "react-select";
import styled from "styled-components";
import Layout from "./Layout";
import brace from "brace";
import AceEditor from "react-ace";

import "brace/mode/json";
import "brace/theme/xcode";

const DEFAULT_PRIORITY = 0;

const ParentsInput = styled(InputGroup)`
    width: 90%;
`;

export default class JobCreationPage extends Component {
    static propTypes = {
        jobTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
        onReady: PropTypes.func.isRequired
    };

    state = {
        type: "",
        parents: [],
        priority: DEFAULT_PRIORITY,
        currentParent: "",
        data: JSON.stringify({}, null, 2),
        timelimit: null,
        saveDisabled: false,
        attemptsMax: null
    };

    componentDidMount() {
        const self = this;
        const parentId = this.props.match.params.parentId;
        if (parentId) {
            const parents = this.state.parents;
            parents.push(parentId);
            self.setState({
                parents: parents
            });
        }
        this.props.onReady();
    }

    setType(e) {
        this.setState({ type: e.target.value });
    }

    handleTypeSelect(event) {
        this.setState({ type: event.target.value });
    }

    handlePriorityChange(value) {
        this.setState({ priority: parseInt(value.value) });
    }

    handleTimeLimitChange(e) {
        this.setState({ timelimit: parseInt(e.target.value) });
    }

    handleAttemptsMaxChange(e) {
        this.setState({ attemptsMax: parseInt(e.target.value) });
    }

    setParent(e) {
        this.setState({ currentParent: e.target.value });
    }

    addParent() {
        const parents = this.state.parents;
        parents.push(this.state.currentParent);
        this.setState({ parents: parents });
    }

    setJobData(data) {
        if (this.isValidJson(data)) {
            this.setState({ data: data, saveDisabled: false });
        } else {
            this.setState({ data: data, saveDisabled: true });
        }
    }

    isValidJson(data) {
        try {
            JSON.parse(data);
        } catch (e) {
            return false;
        }
        return true;
    }

    saveData() {
        const properties = {
            type: this.state.type,
            parents: this.state.parents,
            priority: this.state.priority,
            timeLimit: this.state.timelimit,
            predicate: {
                attemptsMax: this.state.attemptsMax
            },
            data: JSON.parse(this.state.data)
        };
        this.props.addNewJob(properties);
    }

    render() {
        const priorityOptions = [
            { value: DEFAULT_PRIORITY, label: "Normal" },
            { value: -5, label: "Low" },
            { value: 5, label: "High" }
        ];
        const selectedPriorityOption = priorityOptions.find(
            opt => opt.value === this.state.priority
        );
        return (
            <Layout>
                <h1>New job</h1>
                <FormGroup label="Type" labelFor="type" labelInfo="(required)">
                    <div className="select-editable bp3-select bp3-fill bp3-large">
                        <select onChange={this.handleTypeSelect.bind(this)} value={this.state.type}>
                            <For each="type" index="idx" of={this.props.jobTypes}>
                                <option key={idx} value={type}>
                                    {type}
                                </option>
                            </For>
                        </select>
                        <input
                            className="bp3-input bp3-large"
                            type="text"
                            name="type"
                            value={this.state.type}
                            onChange={this.setType.bind(this)}
                        />
                    </div>
                </FormGroup>
                <FormGroup label="Priority" labelFor="priority">
                    <Select
                        options={priorityOptions}
                        id="priority"
                        onChange={this.handlePriorityChange.bind(this)}
                        value={selectedPriorityOption}
                    />
                </FormGroup>
                <FormGroup
                    label="Parents"
                    labelFor="parents"
                    helperText={this.state.parents.join()}
                >
                    <ControlGroup>
                        <ParentsInput
                            type="text"
                            id="parents"
                            value={this.state.currentParent}
                            onChange={this.setParent.bind(this)}
                        />
                        <Button
                            icon="add"
                            onClick={this.addParent.bind(this)}
                            disabled={this.state.currentParent.length < 1}
                        />
                    </ControlGroup>
                </FormGroup>
                <FormGroup label="Time limit" labelFor="timelimit">
                    <InputGroup
                        type="number"
                        id="timelimit"
                        onChange={this.handleTimeLimitChange.bind(this)}
                    />
                </FormGroup>
                <FormGroup
                    label="Max. attempts"
                    labelFor="attemptsMax"
                    labelInfo="(predicate value)"
                >
                    <InputGroup
                        type="number"
                        id="attemptsMax"
                        onChange={this.handleAttemptsMaxChange.bind(this)}
                        min="0"
                        step="1"
                    />
                </FormGroup>
                <FormGroup label="Data" labelFor="data">
                    <AceEditor
                        mode="json"
                        id="data"
                        theme="xcode"
                        height="200px"
                        onChange={this.setJobData.bind(this)}
                        value={this.state.data}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={true}
                        editorProps={{ $blockScrolling: Infinity }}
                    />
                </FormGroup>
                <Button
                    icon="key-enter"
                    text="Save job"
                    onClick={this.saveData.bind(this)}
                    disabled={this.state.saveDisabled || this.state.type.length === 0}
                />
            </Layout>
        );
    }
}
