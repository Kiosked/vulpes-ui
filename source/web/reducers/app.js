import { SET_JOB } from "../actions/types.js";

const INITIAL = {
    jobs: []
};

export default function appReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case SET_JOB:
            const { job, jobId } = action.payload;
            return {
                ...state,
                jobs: {
                    ...state.jobs,
                    [jobId.toString()]: job
                }
            };
        default:
            return state;
    }
}
