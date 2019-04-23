import { createAction } from "redux-actions";
import { WORKERS_SERVER_TIMESTAMP_SET, WORKERS_SET } from "./types.js";

export const setServerTimestamp = createAction(WORKERS_SERVER_TIMESTAMP_SET);
export const setWorkers = createAction(WORKERS_SET);
