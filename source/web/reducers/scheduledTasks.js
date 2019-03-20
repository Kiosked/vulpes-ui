import { SCHEDULED_TASK_SET_MANY } from "../actions/types.js";

const INITIAL = {
    tasks: []
};

export default function scheduledTasksReducer(state = INITIAL, action = {}) {
    switch (action.type) {
        case SCHEDULED_TASK_SET_MANY: {
            const incoming = action.payload;
            const tasks = state.tasks.filter(currentTask => {
                const hasIncoming = !!incoming.find(
                    incomingTask => incomingTask.id === currentTask.id
                );
                return !hasIncoming;
            });
            return {
                ...state,
                tasks: [...tasks, ...incoming]
            };
        }
        default:
            return state;
    }
}
