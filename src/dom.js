'use strict'

import storage from "./storage";
import helper from "./helper";

const content = document.getElementById('content');
let startButton = null;
let totalizer = null;
let taskToPause = null;

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

function toggleRunMode(e = null, stopTask = null) {
    if (taskToPause) {
        taskToPause = null;
        return;
    }

    const runtime = e.target;
    const taskDiv = runtime.parentElement;
    
    taskToPause = taskDiv;
    stopTask(taskToPause);
    runtime.select();
}

function parseRuntime(e) {
    const runtime = e.target;
    const taskDiv = runtime.parentElement;
    let sanitizedValue = '';

    for (const c of runtime.value)
        if (!isNaN(c))
            sanitizedValue += c;

    taskDiv.task.changeRuntime(sanitizedValue);
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
    runtime.addEventListener('focusin', (e) => toggleRunMode(e, parms.stopTask));
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
    if (taskToPause) return;
    let total = 0;
    for (const taskDiv of content.getElementsByClassName('task')) {
        total += taskDiv.task.getRuntimeSeconds();
    }
    totalizer.textContent = helper.getRuntimeString(total);
}

function updateRuntimes() {
    for (const taskDiv of content.getElementsByClassName('task')) {
        if (taskDiv === taskToPause) continue;
        const runtime = taskDiv.getElementsByClassName('runtime')[0];
        runtime.value = taskDiv.task.runtime();
    }
}

export default (() => {
    return {
        getDiv: () => content,
        createTotalizer,
        createRestoreButton,
        createStartButton,
        enableRunMode,
        createNewTask,
        updateTotalizer,
        updateRuntimes,
    }
})();