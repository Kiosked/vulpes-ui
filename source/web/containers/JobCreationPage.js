import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobCreationPage from "../components/JobCreationPage";
import { addJob } from "../library/app";

export default connect(
    (state, ownProps) => ({}),
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
        }
    }
)(JobCreationPage);
