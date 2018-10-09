import React, { Component } from "react";
import styled from "styled-components";
import { Card, Elevation, Button } from "@blueprintjs/core";
import { fetchJobs } from "../library/app.js";
import Loader from "react-loader-spinner";
import Layout from "./Layout.js";

const StyledCard = styled(Card)`
    margin-bottom: 10px;
    padding: 5px;
`;

const StyledButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const LoaderBox = styled.div`
    float: right;
    position: relative;
    bottom: 50px;
`;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            limit: 10
        };
    }

    componentDidMount() {
        fetchJobs(this.state.limit).then(res => {
            this.setState({ jobs: res });
        });
    }

    parseDate(created) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(created);
        return date.toLocaleDateString("en-US", options);
    }

    loadMore() {
        this.setState({ limit: this.state.limit + 10 }, () => {
            fetchJobs(this.state.limit).then(res => {
                this.setState({ jobs: res });
            });
        });
    }

    render() {
        return (
            <Choose>
                <When condition={this.state.jobs}>
                    <Layout>
                        <StyledButton
                            icon="add"
                            text="New job"
                            onClick={this.props.goToNewJobPage}
                        />
                        <For each="job" of={this.state.jobs}>
                            <StyledCard
                                interactive={true}
                                elevation={Elevation.TWO}
                                key={job.id}
                                onClick={() => this.props.goToJobPage(job.id)}
                            >
                                <div>
                                    <h5
                                        className={
                                            job.result.type
                                                ? job.result.type.replace("job/result/", "")
                                                : ""
                                        }
                                    >
                                        {job.id}
                                    </h5>
                                    <ul>
                                        <li>
                                            <strong>Type: </strong>
                                            {job.type}
                                        </li>
                                        <li>
                                            <strong>Status: </strong>
                                            {job.status.replace("job/status/", "")}
                                        </li>
                                        <li>
                                            <strong>Priority: </strong>
                                            <Choose>
                                                <When condition={job.priority === 0}>Normal</When>
                                                <When condition={job.priority === 5}>High</When>
                                                <When condition={job.priority === -5}>Low</When>
                                                <Otherwise>Unknown</Otherwise>
                                            </Choose>
                                        </li>
                                        <li>
                                            <strong>Created: </strong>
                                            {this.parseDate(job.created)}
                                        </li>
                                    </ul>
                                </div>
                                {/**
                                <If condition={job.status.replace("job/status/", "") === "running"}>
                                    <LoaderBox>
                                        <Loader type="Watch" color="#00BFFF" height="50" width="50" />
                                    </LoaderBox>
                                </If> */}
                            </StyledCard>
                        </For>
                        <StyledButton
                            icon="plus"
                            text="More jobs"
                            onClick={this.loadMore.bind(this)}
                        />
                    </Layout>
                </When>
                <Otherwise>
                    <Loader type="Puff" color="#00BFFF" height="100" width="100" />
                </Otherwise>
            </Choose>
        );
    }
}
