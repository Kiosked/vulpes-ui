import { connect } from "react-redux";
import { push } from "react-router-redux";
import debounce from "debounce";
import JobListPage from "../components/JobListPage.js";
import { collectCurrentJobs } from "../library/jobs.js";
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

function processJobs() {
    collectCurrentJobs().catch(err => {
        console.error(err);
        notifyError(`Failed fetching jobs: ${err.message}`);
    });
}

const throttledProcessJobs = debounce(processJobs, 200, false);

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
            setTimeout(() => {
                processJobs();
            }, 100);
        },
        onReady: () => () => {
            processJobs();
        },
        search: term => dispatch => {
            dispatch(setJobPage(0));
            dispatch(setSearchQuery(term));
            setTimeout(throttledProcessJobs, 100);
        },
        setSorting: (column, order) => dispatch => {
            dispatch(setSortColumn(column));
            dispatch(setSortOrder(order));
            setTimeout(throttledProcessJobs, 100);
        }
    }
)(JobListPage);
