import { QUERY_INITIAL } from "../reducers/jobs.js";

const KEY = "jobs";

export function getAllJobs(state) {
    return state[KEY].jobs;
}

export function getCurrentJobs(state) {
    return state[KEY].jobResults;
}

export function getJob(state, jobID) {
    return state[KEY].jobs.find(job => job.id === jobID) || null;
}

export function getJobTree(state, jobID) {
    return state[KEY].jobTrees[jobID];
}

export function getJobTypes(state) {
    const types = getAllJobs(state).map(job => job.type);
    return [...new Set(types)];
}

export function getJobIds(state) {
    const ids = getAllJobs(state).map(job => job.id);
    return [...new Set(ids)];
}

export function getJobsQuery(state) {
    return Object.keys(QUERY_INITIAL).reduce(
        (output, key) => ({
            ...output,
            [key]: state[KEY][key]
        }),
        {}
    );
}

export function getQueryPage(state) {
    return state[KEY].queryPage;
}

export function getQueryPerPage(state) {
    return state[KEY].queryPerPage;
}

export function getQueryResultsFilter(state) {
    return state[KEY].queryFilterResults;
}

export function getQuerySearchTerm(state) {
    return state[KEY].querySearch;
}

export function getQuerySortColumn(state) {
    return state[KEY].querySortColumn;
}

export function getQuerySortOrder(state) {
    return state[KEY].querySortOrder;
}

export function getQueryStatusesFilter(state) {
    return state[KEY].queryFilterStatuses;
}

export function getQueryTotalJobs(state) {
    return state[KEY].jobResultsTotal;
}

export function jobsQueryCustomised(state) {
    return Object.keys(QUERY_INITIAL).some(queryKey => {
        const stateValue = state[KEY][queryKey];
        if (Array.isArray(stateValue)) {
            return stateValue.sort().join(",") !== QUERY_INITIAL[queryKey].sort().join(",");
        }
        return stateValue !== QUERY_INITIAL[queryKey];
    });
}

export function jobsQueryRequestActive(state) {
    return state[KEY].queryRequestActive;
}
