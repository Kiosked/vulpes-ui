import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
    Button,
    Card,
    Colors,
    ControlGroup,
    Elevation,
    HTMLSelect,
    Icon,
    InputGroup,
    Intent,
    NonIdealState
} from "@blueprintjs/core";
import ReactPaginate from "react-paginate";
import Layout from "./Layout.js";
import { JobShape } from "../library/propTypes.js";
import JobItem from "./JobItem.js";
import { SORTING_COLUMNS, SORTING_ORDERS } from "../library/sorting.js";

// const FILTER_OPTIONS = [
//     "Filter",
//     "Type - ascending",
//     "Type - descending",
//     "Created - ascending",
//     "Created - descending",
//     "Priority - ascending",
//     "Priority - descending",
//     "Status - ascending",
//     "Status - descending"
// ];

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
const FilteringCard = styled(Card)`
    margin-bottom: 20px;
`;

export default class JobListPage extends Component {
    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        goToJobPage: PropTypes.func.isRequired,
        goToPage: PropTypes.func.isRequired,
        jobs: PropTypes.arrayOf(JobShape).isRequired,
        jobsPerPage: PropTypes.number.isRequired,
        search: PropTypes.func.isRequired,
        searchTerm: PropTypes.string.isRequired,
        setSorting: PropTypes.func.isRequired,
        sortColumn: PropTypes.string.isRequired,
        sortOrder: PropTypes.string.isRequired,
        totalJobs: PropTypes.number.isRequired
    };

    state = {
        intermediarySearch: ""
    };

    constructor(...args) {
        super(...args);
        this._sortingOptions = [];
        SORTING_COLUMNS.forEach(col => {
            SORTING_ORDERS.forEach(dir => {
                this._sortingOptions.push(`${col} - ${dir}`);
            });
        });
    }

    get page() {
        return this.props.currentPage;
    }

    get pages() {
        return Math.ceil(this.props.totalJobs / this.props.jobsPerPage);
    }

    get selectedFilter() {
        return this._sortingOptions.find(opt => {
            const [col, ord] = opt.split(/\s*-\s*/);
            return col === this.props.sortColumn && ord === this.props.sortOrder;
        });
    }

    clearSearch() {
        this.props.search("");
    }

    handleIntermediarySearch() {
        const searchTerm = this.state.intermediarySearch;
        this.setState(
            {
                intermediarySearch: ""
            },
            () => {
                this.props.search(searchTerm);
            }
        );
    }

    handleIntermediarySearchUpdate(event) {
        this.setState({
            intermediarySearch: event.target.value
        });
    }

    handlePageChange(page) {
        this.props.goToPage(page.selected);
    }

    handleSearchChange(event) {
        this.props.search(event.target.value);
    }

    handleSortingChange(event) {
        const [col, ord] = event.target.value.split(/\s*-\s*/);
        this.props.setSorting(col, ord);
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
                <FilteringCard>
                    <ControlGroup>
                        <HTMLSelect
                            options={this._sortingOptions}
                            value={this.selectedFilter}
                            onChange={::this.handleSortingChange}
                        />
                        <InputGroup
                            placeholder="Search..."
                            value={this.props.searchTerm}
                            onChange={::this.handleSearchChange}
                        />
                        <Button minimal small icon="cross" onClick={::this.clearSearch} />
                    </ControlGroup>
                </FilteringCard>
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
                        <NonIdealState
                            icon="search"
                            title="No job results"
                            description="No jobs were found for the specified search/filter criteria"
                            action={
                                <InputGroup
                                    placeholder="Search..."
                                    value={this.state.intermediarySearch}
                                    onChange={::this.handleIntermediarySearchUpdate}
                                    onKeyPress={event => {
                                        if (event.key === "Enter") {
                                            this.handleIntermediarySearch();
                                        }
                                    }}
                                />
                            }
                        />
                    </Otherwise>
                </Choose>
            </Layout>
        );
    }
}
