import { connect } from "react-redux";
import { push } from "react-router-redux";
import JobList from "../components/JobList";

export default connect(
    (state, ownProps) => ({}),
    {
        goToJobPage: jobId => dispatch => {
            dispatch(push(`/job/${jobId}`));
        },
        goToNewJobPage: () => dispatch => {
            dispatch(push("/new"));
        }
    }
)(JobList);
