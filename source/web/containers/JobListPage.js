import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobListPage from "../components/JobListPage.js";
import { collectJobs } from "../library/jobs.js";
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
        onReady: limit => () => {
            collectJobs(limit).catch(err => {
                console.error(err);
                notifyError(`Failed fetching jobs: ${err.message}`);
            });
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new-job"));
        }
    }
)(JobListPage);
