import { getRoute } from "../selectors/nav.js";
import { clearReloads, reload } from "../library/reload.js";
import { collectCurrentJobs } from "../library/jobs.js";

let lastRoute = null;

function handleRouteChanged(route) {
    console.log("->", route);
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
    }
}

export function subscribeToNavChanges(store) {
    store.subscribe(() => storeChanged(store));
    storeChanged(store);
}
