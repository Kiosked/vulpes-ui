import { LOG_SET } from "../actions/types.js";

const INITIAL = {
    logEntries: []
};

export default function logReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case LOG_SET: {
            const logEntries = action.payload;
            return {
                ...state,
                logEntries: logEntries
            };
        }
        default:
            return state;
    }
}
