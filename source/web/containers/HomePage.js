import { connect } from "react-redux";
import HomePage from "../components/HomePage.js";
import { collectCurrentJobs } from "../library/jobs.js";
import { collectWorkers } from "../library/workers.js";
import { getAllJobs } from "../selectors/jobs.js";
import { getServerTimestamp, getWorkers } from "../selectors/workers.js";

export default connect(
    (state, ownProps) => ({
        jobs: getAllJobs(state),
        serverTimestamp: getServerTimestamp(state),
        workers: getWorkers(state)
    }),
    {
        onReady: () => () => {
            collectCurrentJobs();
            collectWorkers();
        }
    }
)(HomePage);
