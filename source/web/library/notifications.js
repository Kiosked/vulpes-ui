import { Intent, Position, Toaster } from "@blueprintjs/core";

const notifications = Toaster.create({
    className: "notification-toaster",
    position: Position.BOTTOM_RIGHT
});

export function notifyError(message) {
    notifications.show({
        message,
        timeout: 7000,
        intent: Intent.DANGER
    });
}

export function notifySuccess(message) {
    notifications.show({
        message,
        timeout: 5000,
        intent: Intent.SUCCESS
    });
}

export function notifyWarning(message) {
    notifications.show({
        message,
        timeout: 7000,
        intent: Intent.WARNING
    });
}
