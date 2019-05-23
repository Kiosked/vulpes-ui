import { createAction } from "redux-actions";
import { STATS_SET } from "./types.js";

export const setStats = createAction(STATS_SET);
