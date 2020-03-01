import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from "../components/Header.js";
import { clearJobsSearch } from "../actions/jobs.js";

export default connect((state, ownProps) => ({}), {
    onClickBatchImport: () => dispatch => {
        dispatch(push("/import/batch"));
    },
    onClickHome: () => dispatch => {
        dispatch(push("/"));
    },
    onClickJobs: () => dispatch => {
        dispatch(clearJobsSearch());
        dispatch(push("/jobs"));
    },
    onClickReporting: () => dispatch => {
        dispatch(push("/reporting"));
    },
    onClickScheduling: () => dispatch => {
        dispatch(push("/scheduling"));
    }
})(Header);
