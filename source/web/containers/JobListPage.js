import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobListPage from "../components/JobListPage.js";
import { collectAllJobs } from "../library/jobs.js";
import { getJobs } from "../selectors/jobs.js";
import { notifyError } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({
        jobs: getJobs(state)
    }),
    {
        goToJobPage: jobId => dispatch => {
            dispatch(push(`/job/${jobId}`));
        },
        onReady: () => () => {
            collectAllJobs().catch(err => {
                console.error(err);
                notifyError(`Failed fetching jobs: ${err.message}`);
            });
        },
        filterByResultType: (jobs, visibleResultTypes) => () => {
            if (jobs && jobs.length > 0) {
                const newJobs = [];
                for (let job of jobs) {
                    if (job.result.type === null || visibleResultTypes.includes(job.result.type)) {
                        newJobs.push(job);
                    }
                }
                return newJobs;
            }
            return [];
        },
        filterByStatus: (jobs, visibleStatuses) => () => {
            if (jobs && jobs.length > 0) {
                const newJobs = [];
                for (let job of jobs) {
                    if (visibleStatuses.includes(job.status)) {
                        newJobs.push(job);
                    }
                }
                return newJobs;
            }
            return [];
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new-job"));
        }
    }
)(JobListPage);
