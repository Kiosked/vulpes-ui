import { createAction } from "redux-actions";
import {
    JOB_DELETE,
    JOB_SET,
    JOB_SET_MANY,
    JOB_TREE_SET,
    JOBS_LIMIT_SET,
    JOBS_PAGE_SET,
    JOBS_RESET_QUERY,
    JOBS_RESULTS_SET,
    JOBS_STATES_SET,
    JOBS_TOTAL_SET
} from "./types.js";

export const deleteJob = createAction(JOB_DELETE);
export const setJob = createAction(JOB_SET);
export const setJobPage = createAction(JOBS_PAGE_SET);
export const setJobs = createAction(JOB_SET_MANY);
export const setJobTree = createAction(JOB_TREE_SET);
export const setTotalJobs = createAction(JOBS_TOTAL_SET);
