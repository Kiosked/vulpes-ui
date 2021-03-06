import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobPage from "../components/JobPage.js";
import { getJob, getJobTree, jobsQueryCustomised } from "../selectors/jobs.js";
import { collectJob, removeJob, resetJob, stopJob, updateJob } from "../library/jobs.js";
import { notifyError, notifySuccess } from "../library/notifications.js";

export default connect(
    (state, ownProps) => ({
        job: getJob(state, ownProps.match.params.jobId),
        jobID: ownProps.match.params.jobId,
        jobTree: getJobTree(state, ownProps.match.params.jobId),
        searchActive: jobsQueryCustomised(state),
        tab: ownProps.match.params.tab || null
    }),
    {
        changeTab: (jobID, tab) => dispatch => {
            if (tab) {
                dispatch(push(`/job/${jobID}/${tab}`));
            } else {
                dispatch(push(`/job/${jobID}`));
            }
        },
        deleteJob: jobID => dispatch => {
            removeJob(jobID)
                .then(() => {
                    notifySuccess("Successfully deleted job");
                    dispatch(push("/jobs"));
                })
                .catch(err => {
                    console.error(err);
                    notifyError(`Failed to deleted job: ${err.message}`);
                });
        },
        goBackToSearch: () => dispatch => {
            dispatch(push("/jobs"));
        },
        goToJobPage: jobID => dispatch => {
            dispatch(push(`/job/${jobID}`));
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new-job"));
        },
        goToNewDependentJobPage: jobID => dispatch => {
            dispatch(push(`/new-job/parents/${jobID}`));
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
