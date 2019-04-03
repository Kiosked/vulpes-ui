import { connect } from "react-redux";
import { push } from "react-router-redux";
import EditScheduledTaskPage from "../components/EditScheduledTaskPage.js";
import {
    collectScheduledTask,
    createScheduledTask,
    updateScheduledTask
} from "../library/scheduledTasks.js";
import { notifyError, notifySuccess } from "../library/notifications.js";
import { getScheduledTask } from "../selectors/scheduledTasks";

function getTask(taskID, props, state) {
    if (props.mode === "edit") {
        return getScheduledTask(state, taskID);
    }
    return null;
}

export default connect(
    (state, ownProps) => ({
        task: getTask(ownProps.match.params.id, ownProps, state),
        taskID: ownProps.match.params.id
    }),
    {
        loadTask: taskID => () => {
            collectScheduledTask(taskID).catch(err => {
                console.error(err);
                notifyError(`Failed fetching task: ${err.message}`);
            });
        },
        onCreateTask: (title, schedule) => dispatch => {
            createScheduledTask(title, schedule)
                .then(taskID => {
                    notifySuccess(`Task created: ${title}`);
                    dispatch(push(`/scheduling/task/${taskID}`));
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed creating task: ${err.message}`);
                });
        },
        onUpdateTask: (id, title, schedule) => dispatch => {
            updateScheduledTask(id, title, schedule)
                .then(() => {
                    notifySuccess(`Task updated: ${title}`);
                    dispatch(push(`/scheduling/task/${id}`));
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed updating task: ${err.message}`);
                });
        }
    }
)(EditScheduledTaskPage);
