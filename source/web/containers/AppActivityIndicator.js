import { connect } from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator.js";
import { jobsQueryRequestActive } from "../selectors/jobs.js";

export default connect(
    (state, ownProps) => ({
        jobsQueryActive: jobsQueryRequestActive(state)
    }),
    {}
)(AppActivityIndicator);
