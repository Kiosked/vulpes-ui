import { connect } from "react-redux";
import { push } from "react-router-redux";
import ScheduledTaskPage from "../components/ScheduledTaskPage.js";
import { getScheduledTask } from "../selectors/scheduledTasks";
import { collectScheduledTask, toggleScheduledTask } from "../library/scheduledTasks.js";
import { notifyError } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({
        task: getScheduledTask(state, ownProps.match.params.id),
        taskID: ownProps.match.params.id
    }),
    {
        onReady: taskID => () => {
            collectScheduledTask(taskID).catch(err => {
                console.error(err);
                notifyError(`Error: ${err.message}`);
            });
        },
        onToggleTask: (taskID, newState) => () => {
            toggleScheduledTask(taskID, newState)
                .then(() => collectScheduledTask(taskID))
                .catch(err => {
                    console.error(err);
                    notifyError(`Error: ${err.message}`);
                });
        }
    }
)(ScheduledTaskPage);
