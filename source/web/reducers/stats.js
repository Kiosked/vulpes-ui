import { STATS_SET } from "../actions/types.js";

const INITIAL = {
    jobStats: {}
};

export default function statsReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case STATS_SET:
            return {
                ...state,
                jobStats: action.payload
            };
        default:
            return state;
    }
}
