import { connect } from "react-redux";
import { push } from "react-router-redux";
import EditScheduledTaskPage from "../components/EditScheduledTaskPage.js";
import { createScheduledTask } from "../library/scheduledTasks.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onCreateTask: (title, schedule) => dispatch => {
            createScheduledTask(title, schedule)
                .then(taskID => {
                    // nav to scheduled task page
                })
                .catch(err => {
                    console.error(err);
                });
        },
        onUpdateTask: (id, title, schedule) => dispatch => {}
    }
)(EditScheduledTaskPage);
