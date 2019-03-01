import { connect } from "react-redux";
import HomePage from "../components/HomePage.js";
import { collectAllJobs } from "../library/jobs.js";
import { getJobs } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        jobs: getJobs(state)
    }),
    {
        onReady: () => () => collectAllJobs()
    }
)(HomePage);
