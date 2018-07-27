function debounce (fn) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
            }, 1000);
            return;
        }
        timer = setTimeout(() => {
            timer = null;
        }, 1000);
        typeof fn === 'function' && fn.apply(this, args);
    };
}

export {
    debounce
};
