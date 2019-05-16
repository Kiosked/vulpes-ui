import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Card, Colors, Elevation, Button, Icon, Intent, Spinner } from "@blueprintjs/core";
import ReactPaginate from "react-paginate";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";
import { startTimer, stopTimer } from "../library/timers.js";

const VerticallySpacedButton = styled(Button)`
    margin-top: 10px;
    margin-bottom: 10px;
`;
const PaginationBar = styled.div`
    width: 100%;
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    ul {
        display: inline-block;
        padding-left: 15px;
        padding-right: 15px;
    }
    li {
        display: inline-block;
    }
    .paginationItem {
        margin: 0px 4px;
    }
    .paginationItemLink {
        color: ${Colors.INDIGO1};
        padding: 4px;
    }
    .paginationItemLink:hover {
        color: #fff;
        background-color: ${Colors.INDIGO2};
        border-radius: 3px;
        text-decoration: none !important;
    }
    .paginationBreak {
        margin: 0px 5px;
    }
    .activePageItemLink {
        background-color: ${Colors.INDIGO2};
        border-radius: 3px;
        color: #fff;
        padding: 4px;
    }
`;

export default class JobListPage extends Component {
    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        goToJobPage: PropTypes.func.isRequired,
        goToPage: PropTypes.func.isRequired,
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        jobsPerPage: PropTypes.number.isRequired,
        onReady: PropTypes.func.isRequired,
        totalJobs: PropTypes.number.isRequired
    };

    get page() {
        return this.props.currentPage;
    }

    get pages() {
        return Math.ceil(this.props.totalJobs / this.props.jobsPerPage);
    }

    componentDidMount() {
        this.props.onReady();
        this.timer = startTimer(() => this.props.onReady(), 5000);
    }

    componentWillUnmount() {
        stopTimer(this.timer);
    }

    handlePageChange(page) {
        this.props.goToPage(page.selected);
    }

    render() {
        return (
            <Layout>
                <h1>Jobs</h1>
                <VerticallySpacedButton
                    icon="add"
                    text="New job"
                    onClick={this.props.goToNewJobPage}
                />
                <Choose>
                    <When condition={this.props.jobs && this.props.jobs.length > 0}>
                        <For each="job" of={this.props.jobs}>
                            <JobItem
                                job={job}
                                key={job.id}
                                onClick={() => this.props.goToJobPage(job.id)}
                            />
                        </For>
                        <PaginationBar>
                            <ReactPaginate
                                forcePage={this.page}
                                pageCount={this.pages}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={4}
                                previousLabel="￩"
                                nextLabel="￫"
                                pageClassName="paginationItem"
                                pageLinkClassName="paginationItemLink"
                                breakClassName="paginationBreak"
                                activeClassName="activePageItem"
                                activeLinkClassName="activePageItemLink"
                                onPageChange={page => this.handlePageChange(page)}
                            />
                        </PaginationBar>
                    </When>
                    <Otherwise>
                        <Spinner />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
