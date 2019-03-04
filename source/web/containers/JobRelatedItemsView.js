import { connect } from "react-redux";
import JobRelatedItemsView from "../components/JobRelatedItemsView";
import { collectJob, collectAllJobs } from "../library/jobs.js";
import { getJobs } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        jobs: getJobs(state)
    }),
    {
        onReady: (jobID, { parents = true, children = true } = {}) => dispatch => {}
    }
)(JobRelatedItemsView);
