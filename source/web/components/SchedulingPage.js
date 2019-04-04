import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Button } from "@blueprintjs/core";
import Layout from "./Layout";
import { ScheduledTaskShape } from "../library/propTypes.js";
import ScheduledTaskItem from "./ScheduledTaskItem.js";
import { startTimer, stopTimer } from "../library/timers.js";

const VerticallySpacedButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

export default class SchedulingPage extends Component {
    static propTypes = {
        goToNewScheduledTask: PropTypes.func.isRequired,
        goToScheduledTask: PropTypes.func.isRequired,
        onReady: PropTypes.func.isRequired,
        tasks: PropTypes.arrayOf(ScheduledTaskShape).isRequired
    };

    state = {};

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    render() {
        return (
            <Layout>
                <h1>Scheduled Tasks</h1>
                <VerticallySpacedButton
                    icon="add"
                    text="New scheduled task"
                    onClick={this.props.goToNewScheduledTask}
                />
                <Choose>
                    <When condition={this.props.tasks}>
                        <For each="task" of={this.props.tasks}>
                            <ScheduledTaskItem
                                task={task}
                                key={task.id}
                                onClick={() => this.props.goToScheduledTask(task.id)}
                            />
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
