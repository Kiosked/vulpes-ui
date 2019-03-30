import { connect } from "react-redux";
import { push } from "react-router-redux";
import ScheduledTaskPage from "../components/ScheduledTaskPage.js";
import { getScheduledTask } from "../selectors/scheduledTasks";
import {
    addJobToScheduledTask,
    collectScheduledTask,
    toggleScheduledTask
} from "../library/scheduledTasks.js";
import { notifyError } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({
        task: getScheduledTask(state, ownProps.match.params.id),
        taskID: ownProps.match.params.id
    }),
    {
        onAddJob: (taskID, job) => () => {
            addJobToScheduledTask(taskID, job)
                .then(() => collectScheduledTask(taskID))
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed adding job: ${err.message}`);
                });
        },
        onReady: taskID => () => {
            collectScheduledTask(taskID).catch(err => {
                console.error(err);
                notifyError(`Failed fetching task: ${err.message}`);
            });
        },
        onToggleTask: (taskID, newState) => () => {
            toggleScheduledTask(taskID, newState)
                .then(() => collectScheduledTask(taskID))
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed toggling task: ${err.message}`);
                });
        }
    }
)(ScheduledTaskPage);
