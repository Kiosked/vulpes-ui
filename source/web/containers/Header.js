import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from "../components/Header.js";
import { clearJobsSearch } from "../actions/jobs.js";
import { collectCurrentJobs } from "../library/jobs.js";

export default connect(
    (state, ownProps) => ({}),
    {
        onClickLog: () => dispatch => {
            dispatch(push("/log"));
        },
        onClickHome: () => dispatch => {
            dispatch(push("/"));
        },
        onClickJobs: () => dispatch => {
            dispatch(clearJobsSearch());
            dispatch(push("/jobs"));
            collectCurrentJobs();
        },
        onClickScheduling: () => dispatch => {
            dispatch(push("/scheduling"));
        }
    }
)(Header);
