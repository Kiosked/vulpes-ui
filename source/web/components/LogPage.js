import React, { Component } from "react";
import Layout from "./Layout.js";
import styled from "styled-components";
import {
    Button,
    Callout,
    Checkbox,
    Intent,
    Popover,
    PopoverInteractionKind,
    PopoverPosition,
    Spinner
} from "@blueprintjs/core";
import { startTimer, stopTimer } from "../library/timers.js";
import JobPreviewModal from "../containers/JobPreviewModal.js";

const LOG_LEVELS = {
    alert: {
        title: "LOGGER_ALERT",
        intent: Intent.DANGER,
        icon: "warning-sign"
    },
    error: {
        title: "LOGGER_ERROR",
        intent: Intent.DANGER,
        icon: "error"
    },
    warning: {
        title: "LOGGER_WARNING",
        intent: Intent.WARNING,
        icon: "issue"
    },
    info: {
        title: "LOGGER_INFO",
        intent: Intent.PRIMARY,
        icon: "info-sign"
    },
    debug: {
        title: "LOGGER_DEBUG",
        intent: Intent.NONE,
        icon: "cog"
    }
};

const LIMIT = 20;

const StyledCallout = styled(Callout)`
    margin-bottom: 10px;
    cursor: pointer;
`;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
`;

const PaginationButton = styled(Button)`
    margin-left: 10px;
`;

const PaginationContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 25px;
`;

function parseDate(timestamp) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    };
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
}

export default class LogPage extends Component {
    state = {
        offset: 0,
        page: 1,
        visibleLevels: ["alert", "error", "warning", "info"]
    };

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 10000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    onCheckboxValueChange(e, value) {
        const arr = this.state.visibleLevels;
        if (e.target.checked) {
            if (!arr.includes(value)) {
                arr.push(value);
            }
        } else {
            if (arr.indexOf(value) !== -1) {
                arr.splice(arr.indexOf(value), 1);
            }
        }
        this.setState({ visibleLevels: arr });
    }

    filterLogEntries(entries) {
        const start = this.state.offset;
        const end = parseInt(LIMIT + this.state.offset);
        if (entries && entries.length > 0) {
            let newEntries = [];
            for (let entry of entries) {
                if (this.state.visibleLevels.includes(entry.level)) {
                    newEntries.push(entry);
                }
            }
            newEntries = newEntries.reverse();
            return newEntries.splice(start, end);
        }
        return [];
    }

    render() {
        const visibleEntries = this.filterLogEntries(this.props.logEntries);
        return (
            <Layout>
                <h1>Log</h1>
                <Choose>
                    <When condition={this.props.logEntries}>
                        <CheckboxContainer>
                            <Checkbox
                                label="Show alerts"
                                inline={true}
                                onChange={event => this.onCheckboxValueChange(event, "alert")}
                                checked={this.state.visibleLevels.includes("alert")}
                            />
                            <Checkbox
                                label="Show errors"
                                inline={true}
                                onChange={event => this.onCheckboxValueChange(event, "error")}
                                checked={this.state.visibleLevels.includes("error")}
                            />
                            <Checkbox
                                label="Show warnings"
                                inline={true}
                                onChange={event => this.onCheckboxValueChange(event, "warning")}
                                checked={this.state.visibleLevels.includes("warning")}
                            />
                            <Checkbox
                                label="Show info"
                                inline={true}
                                onChange={event => this.onCheckboxValueChange(event, "info")}
                                checked={this.state.visibleLevels.includes("info")}
                            />
                            <Checkbox
                                label="Show debug"
                                inline={true}
                                onChange={event => this.onCheckboxValueChange(event, "debug")}
                                checked={this.state.visibleLevels.includes("debug")}
                            />
                        </CheckboxContainer>
                        <For each="entry" index="idx" of={visibleEntries}>
                            <Popover
                                interactionKind={PopoverInteractionKind.HOVER}
                                content={<JobPreviewModal jobId={entry.jobId} />}
                                key={idx}
                                position={PopoverPosition.TOP}
                                hoverOpenDelay={400}
                                hoverCloseDelay={400}
                                minimal={true}
                            >
                                <StyledCallout
                                    intent={LOG_LEVELS[entry.level].intent}
                                    icon={LOG_LEVELS[entry.level].icon}
                                    key={entry.id}
                                    onClick={() => this.props.goToJobPage(entry.jobId)}
                                >
                                    <strong>{parseDate(entry.timestamp)}</strong>: {entry.msg}
                                </StyledCallout>
                            </Popover>
                        </For>
                        <PaginationContainer>
                            <div>
                                Showing {visibleEntries.length} jobs out of{" "}
                                {this.props.logEntries.length}
                            </div>
                            <div>
                                Page {this.state.page} out of{" "}
                                {Math.ceil(this.props.logEntries.length / LIMIT)}
                            </div>
                            <div>
                                <If condition={this.state.offset > 0}>
                                    <PaginationButton
                                        icon="direction-left"
                                        text="Previous page"
                                        intent={Intent.PRIMARY}
                                        onClick={() =>
                                            this.setState({
                                                offset: parseInt(this.state.offset - LIMIT),
                                                page: this.state.page - 1
                                            })
                                        }
                                    />
                                </If>
                                <If condition={visibleEntries.length >= LIMIT}>
                                    <PaginationButton
                                        icon="direction-right"
                                        text="Next page"
                                        intent={Intent.PRIMARY}
                                        onClick={() =>
                                            this.setState({
                                                offset: parseInt(this.state.offset + LIMIT),
                                                page: this.state.page + 1
                                            })
                                        }
                                    />
                                </If>
                            </div>
                        </PaginationContainer>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
