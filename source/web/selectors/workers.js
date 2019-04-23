const KEY = "workers";

export function getServerTimestamp(state) {
    return state[KEY].serverTimestamp;
}

export function getWorkers(state) {
    return state[KEY].workers;
}
