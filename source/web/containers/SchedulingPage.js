import { connect } from "react-redux";
import { push } from "react-router-redux";
import SchedulingPage from "../components/SchedulingPage";
import { getScheduledTasks } from "../selectors/scheduledTasks";
import { collectAllScheduledTasks } from "../library/scheduledTasks";

export default connect(
    (state, ownProps) => ({
        tasks: getScheduledTasks(state)
    }),
    {
        goToNewScheduledTask: () => dispatch => {},
        onReady: jobID => () => {
            collectAllScheduledTasks();
        }
    }
)(SchedulingPage);
