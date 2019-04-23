import { createAction } from "redux-actions";
import { LOG_SET } from "./types.js";

export const setLog = createAction(LOG_SET);
