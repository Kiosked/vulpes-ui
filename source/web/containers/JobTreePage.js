import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobTreePage from "../components/JobTreePage.js";
import { collectJob, collectJobTree } from "../library/jobs.js";
import { getJob, getJobTree } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        job: getJob(state, ownProps.match.params.jobId),
        jobID: ownProps.match.params.jobId,
        jobTree: getJobTree(state, ownProps.match.params.jobId)
    }),
    {
        goToJobPage: jobId => dispatch => {
            dispatch(push(`/job/${jobId}`));
        },
        goToJobTreePage: jobId => dispatch => {
            dispatch(push(`/job/tree/${jobId}`));
        },
        onReady: jobID => () => {
            collectJob(jobID);
            collectJobTree(jobID);
        }
    }
)(JobTreePage);
