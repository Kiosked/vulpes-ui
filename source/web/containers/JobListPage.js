import { connect } from "react-redux";
import { push } from "react-router-redux";
import debounce from "debounce";
import JobListPage from "../components/JobListPage.js";
import {
    getCurrentJobs,
    getQueryPage,
    getQueryPerPage,
    getQuerySearchTerm,
    getQuerySortColumn,
    getQuerySortOrder,
    getQueryTotalJobs
} from "../selectors/jobs.js";
import { notifyError } from "../library/notifications.js";
import {
    setJobPage,
    setJobs,
    setSearchQuery,
    setSortColumn,
    setSortOrder
} from "../actions/jobs.js";

export default connect(
    (state, ownProps) => ({
        currentPage: getQueryPage(state),
        jobs: getCurrentJobs(state),
        jobsPerPage: getQueryPerPage(state),
        searchTerm: getQuerySearchTerm(state),
        sortColumn: getQuerySortColumn(state),
        sortOrder: getQuerySortOrder(state),
        totalJobs: getQueryTotalJobs(state)
    }),
    {
        goToJobPage: jobId => dispatch => {
            dispatch(push(`/job/${jobId}`));
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new-job"));
        },
        goToPage: pageNum => dispatch => {
            dispatch(setJobs([]));
            dispatch(setJobPage(pageNum));
        },
        search: term => dispatch => {
            dispatch(setJobPage(0));
            dispatch(setSearchQuery(term));
        },
        setSorting: (column, order) => dispatch => {
            dispatch(setSortColumn(column));
            dispatch(setSortOrder(order));
        }
    }
)(JobListPage);
