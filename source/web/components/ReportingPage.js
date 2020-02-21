import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
    Button,
    ButtonGroup,
    Card,
    Classes,
    ControlGroup,
    Dialog,
    EditableText,
    FormGroup,
    Icon,
    InputGroup,
    Intent,
    Switch
} from "@blueprintjs/core";
import Layout from "./Layout";

const FormCard = styled(Card)`
    margin: 0px 16px;
`;
const PatternLI = styled.li`
    font-size: 16px;
    line-height: 20px;
    margin: 8px 0px;
`;

export default class ReportingPage extends Component {
    state = {
        editingIndex: -1,
        editingPattern: "",
        jobTypePatterns: [],
        newJobPattern: "",
        newProperties: null,
        onlySucceeded: true,
        reportingProperties: []
    };

    render() {
        return (
            <Layout>
                <h1>Reporting</h1>
                <FormCard>
                    <h3>Generate Report</h3>
                    <FormGroup label="Job States" labelInfo="(required)">
                        <Switch
                            label="Only succeeded"
                            checked={this.state.onlySucceeded}
                            onChange={evt => this.setState({ onlySucceeded: evt.target.checked })}
                        />
                    </FormGroup>
                    <FormGroup label="Job Types" labelInfo="(optional)">
                        <blockquote className={Classes.BLOCKQUOTE}>
                            Job types are queries on all jobs within the system. They will match
                            exactly to the text to enter. You can use <code>*</code> wild-cards
                            within the queries to symbolise dynamic portions of job types. For
                            example: <code>test/*</code>.
                        </blockquote>
                        <Choose>
                            <When condition={this.state.jobTypePatterns.length > 0}>
                                <ul>
                                    <For each="pattern" of={this.state.jobTypePatterns} index="ind">
                                        <PatternLI key={`item-${ind}`}>
                                            <EditableText
                                                className={Classes.MONOSPACE_TEXT}
                                                multiline={false}
                                                value={
                                                    this.state.editingIndex === ind
                                                        ? this.state.editingPattern
                                                        : this.state.jobTypePatterns[ind]
                                                }
                                                isEditing={this.state.editingIndex === ind}
                                                confirmOnEnterKey={true}
                                                selectAllOnFocus={true}
                                                onConfirm={val =>
                                                    this.setState({
                                                        jobTypePatterns: this.state.jobTypePatterns.map(
                                                            (existing, extInd) =>
                                                                extInd === ind ? val : existing
                                                        )
                                                    })
                                                }
                                                onChange={val =>
                                                    this.setState({
                                                        editingPattern: val
                                                    })
                                                }
                                                onEdit={val =>
                                                    this.setState({
                                                        editingIndex: ind,
                                                        editingPattern: val
                                                    })
                                                }
                                                onCancel={() =>
                                                    this.setState({
                                                        editingIndex: -1,
                                                        editingPattern: ""
                                                    })
                                                }
                                            />
                                        </PatternLI>
                                    </For>
                                </ul>
                            </When>
                            <Otherwise>
                                <i>All job types will match - No type patterns added.</i>
                            </Otherwise>
                        </Choose>
                        <br />
                        <ButtonGroup>
                            <Button
                                text="Add"
                                icon="add"
                                onClick={() =>
                                    this.setState({
                                        jobTypePatterns: [...this.state.jobTypePatterns, "*"]
                                    })
                                }
                            />
                        </ButtonGroup>
                    </FormGroup>
                    <FormGroup label="Reporting Properties" labelInfo="(required)">
                        <blockquote className={Classes.BLOCKQUOTE}>
                            Job types here are also queries that support globbing with{" "}
                            <code>*</code>.
                        </blockquote>
                        <Choose>
                            <When condition={this.state.reportingProperties.length > 0}>
                                <table
                                    className={classNames(
                                        Classes.HTML_TABLE,
                                        Classes.HTML_TABLE_BORDERED,
                                        Classes.HTML_TABLE_STRIPED,
                                        Classes.HTML_TABLE_CONDENSED
                                    )}
                                >
                                    <thead>
                                        <tr>
                                            <th>Job Type</th>
                                            <th>Properties</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <For
                                            each="reportingProperty"
                                            of={this.state.reportingProperties}
                                            ind="index"
                                        >
                                            <tr key={`item-${index}`}>
                                                <td />
                                                <td />
                                                <td>
                                                    <Button
                                                        small
                                                        icon="delete"
                                                        onClick={() =>
                                                            this.setState({
                                                                reportingProperties: this.state.reportingProperties.filter(
                                                                    (item, ind) => ind !== index
                                                                )
                                                            })
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </For>
                                    </tbody>
                                </table>
                            </When>
                            <Otherwise>
                                <i>No reporting properties specified.</i>
                            </Otherwise>
                        </Choose>
                        <br />
                        <ButtonGroup>
                            <Button
                                text="Add"
                                icon="add"
                                onClick={() =>
                                    this.setState({
                                        newJobPattern: "",
                                        newProperties: {
                                            type: "",
                                            properties: []
                                        }
                                    })
                                }
                            />
                        </ButtonGroup>
                    </FormGroup>
                    <hr />
                    <ButtonGroup>
                        <Button text="Reset" intent={Intent.DANGER} />
                        <Button text="Generate report" />
                    </ButtonGroup>
                </FormCard>
                <If condition={!!this.state.newProperties}>{this.renderNewPropertiesDialog()}</If>
            </Layout>
        );
    }

    renderNewPropertiesDialog() {
        return (
            <Dialog
                title="New reporting properties"
                onClose={() => this.setState({ newProperties: null })}
                isOpen={!!this.state.newProperties}
                usePortal={true}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}
            >
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup label="Job Type" labelInfo="(required)">
                        <blockquote className={Classes.BLOCKQUOTE}>
                            Job types are queries on all jobs within the system. They will match
                            exactly to the text to enter. You can use <code>*</code> wild-cards
                            within the queries to symbolise dynamic portions of job types. For
                            example: <code>test/*</code>.
                        </blockquote>
                        <InputGroup
                            value={this.state.newProperties.type}
                            onChange={evt =>
                                this.setState({
                                    newProperties: {
                                        ...this.state.newProperties,
                                        type: evt.target.value
                                    }
                                })
                            }
                        />
                    </FormGroup>
                    <FormGroup label="Job Data Properties" labelInfo="(required)">
                        <table
                            className={classNames(
                                Classes.HTML_TABLE,
                                Classes.HTML_TABLE_BORDERED,
                                Classes.HTML_TABLE_STRIPED,
                                Classes.HTML_TABLE_CONDENSED
                            )}
                        >
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                <For
                                    each="propertyPath"
                                    of={this.state.newProperties.properties}
                                    ind="index"
                                >
                                    <tr key={`item-${index}`}>
                                        <td>
                                            <code>{propertyPath}</code>
                                        </td>
                                        <td>
                                            <Button
                                                small
                                                icon="delete"
                                                onClick={() =>
                                                    this.setState({
                                                        newProperties: {
                                                            ...this.state.newProperties,
                                                            properties: this.state.newProperties.properties.filter(
                                                                (prop, ind) => ind !== index
                                                            )
                                                        }
                                                    })
                                                }
                                            />
                                        </td>
                                    </tr>
                                </For>
                            </tbody>
                        </table>
                    </FormGroup>
                    <ControlGroup>
                        <InputGroup
                            placeholder="Enter new job pattern..."
                            value={this.state.newJobPattern}
                            onChange={evt =>
                                this.setState({
                                    newJobPattern: evt.target.value
                                })
                            }
                        />
                        <Button
                            text="Add"
                            onClick={() =>
                                this.state.newJobPattern.trim() &&
                                this.setState({
                                    newJobPattern: "",
                                    newProperties: {
                                        ...this.state.newProperties,
                                        properties: [
                                            ...this.state.newProperties.properties,
                                            this.state.newJobPattern
                                        ]
                                    }
                                })
                            }
                        />
                    </ControlGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            text="Add"
                            icon="add"
                            intent={Intent.PRIMARY}
                            disabled={
                                !this.state.newProperties ||
                                this.state.newProperties.type.trim() == "" ||
                                this.state.newProperties.properties.length === 0
                            }
                        />
                        <Button
                            text="Cancel"
                            onClick={() =>
                                this.setState({
                                    newProperties: null
                                })
                            }
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}
