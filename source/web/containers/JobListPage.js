import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobListPage from "../components/JobListPage.js";
import { collectCurrentJobs } from "../library/jobs.js";
import {
    getCurrentJobs,
    getQueryPage,
    getQueryPerPage,
    getQueryTotalJobs
} from "../selectors/jobs.js";
import { notifyError } from "../library/notifications.js";
import { setJobPage, setJobs } from "../actions/jobs.js";

function processJobs() {
    collectCurrentJobs().catch(err => {
        console.error(err);
        notifyError(`Failed fetching jobs: ${err.message}`);
    });
}

export default connect(
    (state, ownProps) => ({
        currentPage: getQueryPage(state),
        jobs: getCurrentJobs(state),
        jobsPerPage: getQueryPerPage(state),
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
            }, 1150);
        },
        onReady: () => () => {
            processJobs();
        }
    }
)(JobListPage);
