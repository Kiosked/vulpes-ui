export function startTimer(callback, delay) {
    const payload = { enabled: true, timer: null };
    const execute = () => {
        let retVal;
        try {
            retVal = callback();
        } catch (err) {
            console.error(err);
        }
        if (retVal && typeof retVal.then === "function") {
            retVal.then(startTimer, startTimer);
            return;
        }
        startTimer();
    };
    const startTimer = () => {
        if (payload.enabled !== true) {
            return;
        }
        payload.timer = setTimeout(execute, delay);
    };
    startTimer();
    return payload;
}

export function stopTimer(payload) {
    payload.enabled = false;
    clearTimeout(payload.timer);
}
