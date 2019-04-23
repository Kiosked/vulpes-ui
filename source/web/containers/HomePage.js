import { connect } from "react-redux";
import HomePage from "../components/HomePage.js";
import { collectAllJobs } from "../library/jobs.js";
import { collectWorkers } from "../library/workers.js";
import { getJobs } from "../selectors/jobs.js";
import { getServerTimestamp, getWorkers } from "../selectors/workers.js";

export default connect(
    (state, ownProps) => ({
        jobs: getJobs(state),
        serverTimestamp: getServerTimestamp(state),
        workers: getWorkers(state)
    }),
    {
        onReady: () => () => {
            collectAllJobs();
            collectWorkers();
        }
    }
)(HomePage);
