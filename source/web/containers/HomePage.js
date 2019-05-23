import { connect } from "react-redux";
import HomePage from "../components/HomePage.js";
import { collectStats } from "../library/stats.js";
import { collectWorkers } from "../library/workers.js";
import { getJobStats } from "../selectors/stats.js";
import { getServerTimestamp, getWorkers } from "../selectors/workers.js";

export default connect(
    (state, ownProps) => ({
        jobStats: getJobStats(state),
        serverTimestamp: getServerTimestamp(state),
        workers: getWorkers(state)
    }),
    {
        onReady: () => () => {
            collectStats();
            collectWorkers();
        }
    }
)(HomePage);
