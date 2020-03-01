const KEY = "routing";

export function getRoute(state) {
    return state[KEY].location.pathname;
}
