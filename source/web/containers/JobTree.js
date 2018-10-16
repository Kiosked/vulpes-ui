import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobTree from "../components/JobTree.js";
import { fetchJob } from "../library/app.js";

export default connect(
    (state, ownProps) => ({
        jobId: ownProps.match.params.jobId
    }),
    {
        goToJobPage: jobId => dispatch => {
            fetchJob(jobId);
            dispatch(push(`/job/${jobId}`));
        },
        goToJobTreePage: jobId => dispatch => {
            dispatch(push(`/job/tree/${jobId}`));
        }
    }
)(JobTree);
