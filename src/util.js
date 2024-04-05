'use strict'

export default (() => {
    return {
        getRuntimeString : (runtimeSeconds) => {
            let hours = Math.floor(runtimeSeconds / 3600);
            let minutes = Math.floor((runtimeSeconds % 3600) / 60);
            let seconds = Math.floor((runtimeSeconds % 3600) % 60);

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            return `${hours}:${minutes}:${seconds}`;
        }
    }
})();