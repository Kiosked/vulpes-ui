import React, { Component } from "react";
import Layout from "./Layout.js";
import styled from "styled-components";
import { Callout, Checkbox, Intent, Spinner } from "@blueprintjs/core";

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

const StyledCallout = styled(Callout)`
    margin-bottom: 10px;
`;

const CheckboxContainer = styled.div`
    margin-bottom: 10px;
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
        visibleLevels: ["alert", "error", "warning", "info", "debug"]
    };

    componentDidMount() {
        this.props.onReady();
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
        if (entries && entries.length > 0) {
            const newEntries = [];
            for (let entry of entries) {
                if (this.state.visibleLevels.includes(entry.level)) {
                    newEntries.push(entry);
                }
            }
            return newEntries.reverse();
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
                            <StyledCallout
                                intent={LOG_LEVELS[entry.level].intent}
                                icon={LOG_LEVELS[entry.level].icon}
                                key={idx}
                            >
                                <strong>{parseDate(entry.timestamp)}</strong>: {entry.msg}
                            </StyledCallout>
                        </For>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
