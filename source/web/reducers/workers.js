import { WORKERS_SERVER_TIMESTAMP_SET, WORKERS_SET } from "../actions/types.js";

const INITIAL = {
    serverTimestamp: null,
    workers: []
};

export default function workersReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case WORKERS_SET:
            return {
                ...state,
                workers: [...action.payload]
            };
        case WORKERS_SERVER_TIMESTAMP_SET:
            return {
                ...state,
                serverTimestamp: action.payload
            };
        default:
            return state;
    }
}
