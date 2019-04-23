import { connect } from "react-redux";
import LogPage from "../components/LogPage.js";
import { getFullLog } from "../library/log.js";
import { getLogEntries } from "../selectors/log.js";

export default connect(
    (state, ownProps) => ({
        logEntries: getLogEntries(state)
    }),
    {
        onReady: () => () => {
            getFullLog().catch(err => {
                console.error(err);
                notifyError(`Failed fetching log: ${err.message}`);
            });
        }
    }
)(LogPage);
