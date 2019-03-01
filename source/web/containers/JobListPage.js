import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobList from "../components/JobListPage.js";
import { collectJob, collectAllJobs } from "../library/jobs.js";
import { getJobs } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        jobs: getJobs(state)
    }),
    {
        goToJobPage: jobId => dispatch => {
            // collectJob(jobId);
            dispatch(push(`/job/${jobId}`));
        },
        onReady: () => () => collectAllJobs(),
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new"));
        }
    }
)(JobList);
