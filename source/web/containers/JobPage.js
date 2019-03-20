import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobPage from "../components/JobPage.js";
import { getJob, getJobTree } from "../selectors/jobs.js";
import { collectJob, collectJobTree, resetJob, stopJob, updateJob } from "../library/jobs.js";

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
        resetJob: jobID => () => {
            resetJob(jobID)
                .then(() => {
                    return collectJob(jobID);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        stopJob: jobID => () => {
            stopJob(jobID)
                .then(() => {
                    return collectJob(jobID);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        updateJob: (jobID, properties) => () => {
            return updateJob(jobID, properties)
                .then(() => collectJob(jobID))
                .catch(err => {
                    console.log(err);
                });
        }
    }
)(JobPage);
