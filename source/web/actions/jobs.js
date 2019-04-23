import { createAction } from "redux-actions";
import { JOB_DELETE, JOB_SET, JOB_SET_MANY, JOB_SET_REPLACE, JOB_TREE_SET } from "./types.js";

export const deleteJob = createAction(JOB_DELETE);
export const replaceJobs = createAction(JOB_SET_REPLACE);
export const setJob = createAction(JOB_SET);
export const setJobs = createAction(JOB_SET_MANY);
export const setJobTree = createAction(JOB_TREE_SET);
