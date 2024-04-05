'use strict'

import storage from "./storage";
import util from "./util";

const content = document.getElementById('content');
let startButton = null;
let totalizer = null;
let pauseRuntime = false;

function createTotalizer() {
    if (totalizer) return;
    const _totalizer = document.createElement('label');
    _totalizer.id = 'totalizer';
    _totalizer.textContent = '00:00:00';
    _totalizer.classList.add('disabled');
    content.appendChild(_totalizer);
    totalizer = _totalizer;
}

function createRestoreButton(restoreTasks = null) {
    const restoreButton = document.createElement('button');
    restoreButton.id = 'restoreButton';
    restoreButton.textContent = 'restore';
    restoreButton.addEventListener('click', restoreTasks);
    content.appendChild(restoreButton);
}

function createStartButton(startNewTask = null) {
    if (startButton) return;
    const _startButton = document.createElement('button');
    _startButton.id = 'startButton';
    _startButton.textContent = 'New Task';
    _startButton.classList.add('new');
    _startButton.addEventListener('click', startNewTask);
    content.appendChild(_startButton);
    startButton = _startButton;
}

function enableRunMode(restoreTasks = null) {
    // change restore button into a description label for the totalizer
    restoreButton.removeEventListener('click', restoreTasks);
    restoreButton.classList.add('label');
    restoreButton.textContent = "Total:";
    // unhide totalizer
    totalizer.classList.remove('disabled');
}

function toggleRunMode(e = null, stopTasks = null) {
    if (!pauseRuntime) {
        stopTasks();
        e.target.select();
    }

    pauseRuntime = !pauseRuntime;
}

function parseRuntime(e) {
    let sanitizedValue = '';

    for (const c of e.target.value)
        if (!isNaN(c))
            sanitizedValue += c;

    e.target.parentElement.task.changeRuntime(sanitizedValue);
    toggleRunMode();
    storage.storeTasks(content);
}

function createNewTask(parms) {
    const timerButton = document.createElement('button');
    timerButton.classList.add('timer');
    if (parms.task === null || parms.task.isRunning()) {
        timerButton.classList.add('stop');
        timerButton.textContent = 'Stop';
    }
    else {
        timerButton.classList.add('start');
        timerButton.textContent = 'Start';
    }
    timerButton.addEventListener('click', parms.toggleTimer);

    const discardButton = document.createElement('button');
    discardButton.classList.add('discard');
    discardButton.textContent = 'discard';
    discardButton.addEventListener('click', parms.discardTask);

    const runtime = document.createElement('input');
    runtime.classList.add('runtime');
    runtime.placeholder = '0:00:00';
    runtime.addEventListener('focusin', (e) => toggleRunMode(e, parms.stopTasks));
    runtime.addEventListener('focusout', parseRuntime);

    const description = document.createElement('input');
    description.classList.add('description');
    description.placeholder = 'describe your task...';
    description.addEventListener('change', () => storage.storeTasks(content));

    const newTask = document.createElement('div');
    newTask.description = description;
    newTask.classList.add('task');
    newTask.appendChild(timerButton);
    newTask.appendChild(discardButton);
    newTask.appendChild(runtime);
    newTask.appendChild(description);

    content.insertBefore(newTask, startButton);
    
    description.focus();

    return newTask;
}

function updateTotalizer() {
    if (pauseRuntime) return;
    let total = 0;
    const children = content.getElementsByClassName('task');
    for (const child of children) {
        total += child.task.getRuntimeSeconds();
    }
    totalizer.textContent = util.getRuntimeString(total);
}

function updateRuntimes() {
    if (pauseRuntime) return;
    const children = content.children;
    for (const child of children) {
        if (child.task === undefined) {
            continue;
        }
        const runtime = child.getElementsByClassName('runtime')[0];
        runtime.value = child.task.runtime();
    }
}

export default (() => {
    return {
        getDiv: () => content,
        createTotalizer,
        createRestoreButton,
        createStartButton,
        disableRestoreButton: enableRunMode,
        createNewTask,
        updateTotalizer,
        updateRuntimes,
    }
})();