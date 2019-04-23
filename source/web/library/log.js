import axios from "axios";
import joinURL from "url-join";
import { dispatch, getState } from "../redux/index.js";
import { setLog } from "../actions/log";

const API_BASE = window.vulpesAPIBase;

export function getFullLog() {
    return axios
        .get(joinURL(API_BASE, "/log"))
        .then(function(response) {
            if (response.data.entries) {
                dispatch(setLog(response.data));
            }
        })
        .catch(function(error) {
            console.log(error);
            throw error;
        });
}
