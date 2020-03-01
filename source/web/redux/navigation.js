import objectHash from "object-hash";
import { getRoute } from "../selectors/nav.js";
import { getJobsQuery } from "../selectors/jobs.js";
import { clearReloads, reload } from "../library/reload.js";
import { collectCurrentJobs, collectJob, collectJobTree } from "../library/jobs.js";

const JOB_PAGE_REXP = /^\/job\/([a-f0-9-]+)(\/|$)/;

let lastRoute = null,
    lastQueryHash = null;

function handleJobsQueryChanged() {
    clearReloads();
    reload(collectCurrentJobs);
}

function handleRouteChanged(route) {
    // console.log("->", route);
    clearReloads();
    if (route === "/jobs") {
        reload(collectCurrentJobs);
    } else if (JOB_PAGE_REXP.test(route)) {
        const [, jobID] = route.match(JOB_PAGE_REXP);
        reload(() => collectJob(jobID));
        reload(() => collectJobTree(jobID), 6000, 25000);
    }
}

function storeChanged(store) {
    const state = store.getState();
    const newRoute = getRoute(state);
    if (lastRoute !== newRoute) {
        lastRoute = newRoute;
        handleRouteChanged(newRoute);
    } else if (newRoute === "/jobs") {
        const newQueryHash = objectHash(getJobsQuery(state));
        if (newQueryHash !== lastQueryHash) {
            lastQueryHash = newQueryHash;
            handleJobsQueryChanged();
        }
    }
}

export function subscribeToNavChanges(store) {
    store.subscribe(() => storeChanged(store));
    storeChanged(store);
}
