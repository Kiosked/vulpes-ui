const KEY = "scheduledTasks";

export function getScheduledTasks(state) {
    return state[KEY].tasks;
}
