import { connect } from "react-redux";
import { push } from "react-router-redux";
import SchedulingPage from "../components/SchedulingPage";
// import { getJob, getJobTree } from "../selectors/jobs.js";
// import { collectJob, collectJobTree, resetJob, stopJob, updateJob } from "../library/jobs.js";

export default connect(
    (state, ownProps) => ({
        // job: getJob(state, ownProps.match.params.jobId),
        // jobID: ownProps.match.params.jobId,
        // jobTree: getJobTree(state, ownProps.match.params.jobId)
    }),
    {
        goToNewScheduledTask: () => dispatch => {},
        onReady: jobID => () => {
            // collectJob(jobID);
            // collectJobTree(jobID);
        }
    }
)(SchedulingPage);
