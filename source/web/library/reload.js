const __reloads = [];

export function clearReloads() {
    __reloads.forEach(cb => cb());
    __reloads.splice(0, Infinity);
}

export function reload(fn, delay = 5000, errDelay = 20000) {
    let active = true,
        timer;
    const runFn = () => {
        if (!active) return;
        try {
            const res = fn();
            if (res && typeof res.then === "function") {
                const rerun = () => {
                    clearTimeout(timer);
                    timer = setTimeout(runFn, delay);
                };
                res.then(rerun, rerun);
            } else {
                clearTimeout(timer);
                timer = setTimeout(runFn, delay);
            }
        } catch (err) {
            console.error(err);
            clearTimeout(timer);
            timer = setTimeout(runFn, errDelay);
        }
    };
    timer = setTimeout(runFn, 0);
    __reloads.push(() => {
        active = false;
        clearTimeout(timer);
    });
}
