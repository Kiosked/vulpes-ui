import objectHash from "object-hash";
import { getRoute } from "../selectors/nav.js";
import { getJobsQuery } from "../selectors/jobs.js";
import { clearReloads, reload } from "../library/reload.js";
import { collectCurrentJobs } from "../library/jobs.js";

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
