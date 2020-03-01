import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobCreationPage from "../components/JobCreationPage";
import { addJob, collectCurrentJobs } from "../library/jobs.js";
import { getJobIds, getJobTypes } from "../selectors/jobs.js";
import { notifyError } from "../library/notifications.js";

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
            collectCurrentJobs().catch(err => {
                console.error(err);
                notifyError(`Failed fetching jobs: ${err.message}`);
            });
        }
    }
)(JobCreationPage);
