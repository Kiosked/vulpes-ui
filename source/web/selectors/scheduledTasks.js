const KEY = "scheduledTasks";

export function getScheduledTask(state, taskID) {
    return state[KEY].tasks.find(task => task.id === taskID) || null;
}

export function getScheduledTasks(state) {
    return state[KEY].tasks;
}
