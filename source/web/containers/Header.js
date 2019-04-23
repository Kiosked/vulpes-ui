import { connect } from "react-redux";
import { push } from "react-router-redux";
import Header from "../components/Header.js";

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
            dispatch(push("/jobs"));
        },
        onClickScheduling: () => dispatch => {
            dispatch(push("/scheduling"));
        }
    }
)(Header);
