import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobCreationPage from "../components/JobCreationPage";
import { addJob, collectAllJobs } from "../library/jobs.js";
import { getJobIds, getJobTypes } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        initialParent: ownProps.match.params.parentID || null,
        jobTypes: getJobTypes(state),
        jobIds: getJobIds(state)
    }),
    {
        addNewJob: properties => dispatch => {
            addJob(properties)
                .then(res => {
                    const jobId = res;
                    dispatch(push(`/job/${jobId}`));
                })
                .catch(err => {
                    console.log(err);
                });
        },
        onReady: () => () => {
            collectAllJobs();
        }
    }
)(JobCreationPage);
