import { createAction } from "redux-actions";
import { SCHEDULED_TASK_SET_MANY } from "./types.js";

export const setScheduledTasks = createAction(SCHEDULED_TASK_SET_MANY);
