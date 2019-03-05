import { connect } from "react-redux";
import JobRelatedItemsView from "../components/JobRelatedItemsView";
import { getJobTree } from "../selectors/jobs.js";
import { getJobs } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        jobTree: getJobTree(state, ownProps.job.id)
    }),
    {}
)(JobRelatedItemsView);
