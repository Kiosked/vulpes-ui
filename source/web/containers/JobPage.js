import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobPage from "../components/JobPage.js";
import { getJob } from "../selectors/app.js";
import { fetchJob } from "../library/app.js";

export default connect(
    (state, ownProps) => ({
        job: getJob(state, ownProps.match.params.jobId)
    }),
    {
        goToJobPage: jobId => dispatch => {
            fetchJob(jobId);
            dispatch(push(`/job/${jobId}`));
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new"));
        },
        goToNewDependentJobPage: jobId => dispatch => {
            dispatch(push(`/new/parents/${jobId}`));
        }
    }
)(JobPage);
