import {
    JOB_DELETE,
    JOB_SET,
    JOB_SET_MANY,
    JOB_TREE_SET,
    JOBS_LIMIT_SET,
    JOBS_PAGE_SET,
    JOBS_RESET_QUERY,
    JOBS_RESULTS_SET,
    JOBS_STATES_SET,
    JOBS_TOTAL_SET
} from "../actions/types.js";

const QUERY_INITIAL = {
    queryFilterResults: [],
    queryFilterStatuses: [],
    queryPage: 0,
    queryPerPage: 15,
    queryTotal: 0
};
const INITIAL = {
    jobs: [],
    jobResults: [],
    jobTrees: {},
    ...QUERY_INITIAL
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
                jobs: [...jobs, ...incoming],
                jobResults: [...incoming]
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
        case JOBS_LIMIT_SET:
            return {
                ...state,
                queryPerPage: action.payload
            };
        case JOBS_PAGE_SET:
            return {
                ...state,
                queryPage: action.payload
            };
        case JOBS_RESET_QUERY:
            return {
                ...state,
                ...QUERY_INITIAL
            };
        case JOBS_RESULTS_SET:
            return {
                ...state,
                queryFilterResults: [...action.payload]
            };
        case JOBS_STATES_SET:
            return {
                ...state,
                queryFilterStatuses: [...action.payload]
            };
        case JOBS_TOTAL_SET:
            return {
                ...state,
                queryTotal: action.payload
            };
        default:
            return state;
    }
}
