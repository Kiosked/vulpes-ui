import {
    JOB_DELETE,
    JOB_SET,
    JOB_SET_MANY,
    JOB_SET_REPLACE,
    JOB_TREE_SET
} from "../actions/types.js";
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
        case JOB_SET_REPLACE: {
            const jobs = action.payload;
            return {
                ...state,
                jobs: jobs
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
        case JOB_DELETE: {
            const { jobId } = action.payload;
            const jobs = state.jobs.filter(job => job.id !== jobId);
            return {
                ...state,
                jobs: jobs
            };
        }
        default:
            return state;
    }
}
