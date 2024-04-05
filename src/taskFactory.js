'use strict'

import util from "./util";

const reverse = (str) => str.split('').reverse().join('');

function create(startTime = 0, tempRuntime = 0, description = '') {
    const obj = {
        startTime,
        tempRuntime,
        description,
    }

    return createFromObject(obj);
}

function createFromObject(obj) {
    let startTime = obj.startTime;
    let tempRuntime = obj.tempRuntime;
    let description = obj.description;

    function toObject() {
        return {
            startTime,
            tempRuntime,
            description,
        }
    }

    function changeRuntime(newRuntime) {
        let newHr = 0;
        let newMn = 0;
        let newSc = 0;

        const r = reverse(newRuntime);

        if (newRuntime.length > 0) newSc = parseInt(reverse(r.substr(0, 2)));
        if (newRuntime.length > 2) newMn = parseInt(reverse(r.substr(2, 2))) * 60;
        if (newRuntime.length > 4) newHr = parseInt(reverse(r.substr(4))) * 3600;

        tempRuntime = (newHr + newMn + newSc) * 1000;
    }

    function getRuntimeSeconds() {
        return startTime > 0
        ? Math.floor((tempRuntime + Date.now() - startTime) / 1000)
        : Math.floor(tempRuntime / 1000);
    }

    function stop() {
        if (startTime > 0) {
            tempRuntime += Date.now() - startTime;
            startTime = 0;
        }
    }

    return {
        start: () => startTime = Date.now(),
        changeRuntime,
        isRunning: () => startTime !== 0,
        getDescription: () => description,
        setDescription: (value) => description = value,
        runtime: () => util.getRuntimeString(getRuntimeSeconds()),
        stop,
        getRuntimeSeconds,
        toObject,
    }
}

export default (() => {
    return {
        create,
        createFromObject,
    }
})();