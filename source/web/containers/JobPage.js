import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobPage from "../components/JobPage.js";
import { getJob, getJobTree } from "../selectors/jobs.js";
import { collectJob, collectJobTree, resetJob, stopJob, updateJob } from "../library/jobs.js";
import { notifyError, notifySuccess } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({
        job: getJob(state, ownProps.match.params.jobId),
        jobID: ownProps.match.params.jobId,
        jobTree: getJobTree(state, ownProps.match.params.jobId)
    }),
    {
        goToJobPage: jobID => dispatch => {
            dispatch(push(`/job/${jobID}`));
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new-job"));
        },
        goToNewDependentJobPage: jobID => dispatch => {
            dispatch(push(`/new-job/parents/${jobID}`));
        },
        onReady: jobID => () => {
            collectJob(jobID);
            collectJobTree(jobID);
        },
        removeAttachment: (jobID, attachmentID) => (dispatch, getState) => {
            const job = getJob(getState(), jobID);
            const attachmentKey = `%attachment:${attachmentID}`;
            const payload = {
                result: {
                    data: Object.keys(job.result.data).reduce(
                        (output, itemKey) =>
                            itemKey === attachmentKey
                                ? output
                                : { ...output, [itemKey]: job.result.data[itemKey] },
                        {}
                    )
                }
            };
            return updateJob(jobID, payload)
                .then(() => {
                    notifySuccess("Successfully removed attactment");
                    return collectJob(jobID);
                })
                .catch(err => {
                    console.log(err);
                    notifyError(`Failed to remove attactment: ${err.message}`);
                });
        },
        resetJob: jobID => () => {
            resetJob(jobID)
                .then(() => {
                    notifySuccess("Successfully reset job");
                    return collectJob(jobID);
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed to reset job: ${err.message}`);
                });
        },
        stopJob: jobID => () => {
            stopJob(jobID)
                .then(() => {
                    notifySuccess("Successfully stopped job");
                    return collectJob(jobID);
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed to stop job: ${err.message}`);
                });
        },
        updateJob: (jobID, properties) => () => {
            return updateJob(jobID, properties)
                .then(() => collectJob(jobID))
                .catch(err => {
                    console.log(err);
                    notifyError(`Failed to update job: ${err.message}`);
                });
        }
    }
)(JobPage);
