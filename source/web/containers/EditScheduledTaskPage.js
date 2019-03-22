import { connect } from "react-redux";
import { push } from "react-router-redux";
import EditScheduledTaskPage from "../components/EditScheduledTaskPage.js";
import { createScheduledTask } from "../library/scheduledTasks.js";
import { notifyError, notifySuccess } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onCreateTask: (title, schedule) => dispatch => {
            createScheduledTask(title, schedule)
                .then(taskID => {
                    notifySuccess(`Task created: ${title}`);
                    dispatch(push(`/scheduling/task/${taskID}`));
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Error: ${err.message}`);
                });
        },
        onUpdateTask: (id, title, schedule) => dispatch => {}
    }
)(EditScheduledTaskPage);
