import { JOB_SET, JOB_SET_MANY, JOB_TREE_SET } from "../actions/types.js";

const INITIAL = {
    jobs: [],
    jobTrees: {}
};

export default function jobsReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case JOB_SET: {
            const job = action.payload;
            const jobs = state.jobs.filter(currentJob => currentJob.id !== job.id);
            return {
                ...state,
                jobs: [...jobs, job]
            };
        }
        case JOB_SET_MANY: {
            const incoming = action.payload;
            const jobs = state.jobs.filter(currentJob => {
                const hasIncoming = !!incoming.find(
                    incomingJob => incomingJob.id === currentJob.id
                );
                return !hasIncoming;
            });
            return {
                ...state,
                jobs: [...jobs, ...incoming]
            };
        }
        case JOB_TREE_SET: {
            const { jobID, tree } = action.payload;
            return {
                ...state,
                jobTrees: {
                    [jobID]: tree
                }
            };
        }
        default:
            return state;
    }
}
