import { connect } from "react-redux";
import { push } from "react-router-redux";
import ScheduledTaskPage from "../components/ScheduledTaskPage.js";
import { getScheduledTask } from "../selectors/scheduledTasks";
import {
    addJobToScheduledTask,
    collectScheduledTask,
    setScheduledTaskJobs,
    toggleScheduledTask
} from "../library/scheduledTasks.js";
import { notifyError, notifySuccess } from "../library/notifications.js";

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
        onDeleteJobFromTask: (taskID, jobNumber) => (dispatch, getState) => {
            const { jobs } = getScheduledTask(getState(), taskID);
            const jobInd = jobs.findIndex(job => `${job.id}` === `${jobNumber}`);
            if (jobInd === -1) {
                notifyError(`Failed deleting job with ID: ${jobNumber}`);
                return;
            }
            const updatedJobs = [...jobs];
            updatedJobs.splice(jobInd, 1);
            return setScheduledTaskJobs(taskID, updatedJobs)
                .then(() => collectScheduledTask(taskID))
                .then(() => {
                    notifySuccess(`Successfully deleted job: ${jobNumber}`);
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed setting task jobs: ${err.message}`);
                });
        },
        onEditTask: taskID => dispatch => {
            dispatch(push(`/scheduling/edit/${taskID}`));
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
