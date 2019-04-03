import { SCHEDULED_TASK_SET, SCHEDULED_TASK_SET_MANY } from "../actions/types.js";

const INITIAL = {
    tasks: []
};

export default function scheduledTasksReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case SCHEDULED_TASK_SET: {
            const task = action.payload;
            const tasks = state.tasks.filter(currentTask => currentTask.id !== task.id);
            return {
                ...state,
                tasks: [...tasks, task]
            };
        }
        case SCHEDULED_TASK_SET_MANY:
            return {
                ...state,
                tasks: [...action.payload]
            };
        default:
            return state;
    }
}
