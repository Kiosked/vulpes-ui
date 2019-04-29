import { connect } from "react-redux";
import JobPreviewModal from "../components/JobPreviewModal.js";
import { getJob } from "../selectors/jobs.js";
import { collectJob } from "../library/jobs.js";

export default connect(
    (state, ownProps) => ({
        job: getJob(state, ownProps.jobId),
        jobID: ownProps.jobId
    }),
    {
        onReady: jobID => () => {
            collectJob(jobID);
        }
    }
)(JobPreviewModal);
