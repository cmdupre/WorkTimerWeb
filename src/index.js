'use strict'

import taskFactory from "./taskFactory";
import dom from "./dom";
import storage from "./storage";

function restoreTasks() {
    dom.enableRunMode(restoreTasks);
    for (const item of storage.getTaskItems()) {
        const task = taskFactory.createFromObject(item);
        startNewTask(null, task);
    }
}

function toggleTimer(e) {
    const timerButton = e.target;
    const taskDiv = timerButton.parentElement;

    if (timerButton.textContent === 'Stop') {
        taskDiv.task.stop();
        timerButton.textContent = 'Start';
        timerButton.classList.remove('stop');
        timerButton.classList.add('start');
    }
    else {
        stopTasks();
        taskDiv.task.start();
        timerButton.textContent = 'Stop';
        timerButton.classList.remove('start');
        timerButton.classList.add('stop');
    }
    storage.storeTasks(dom.getDiv());
}

function discardTask(e) {
    // todo: ensure all event listeners are deleted

    const discardButton = e.target;
    const taskDiv = discardButton.parentElement;

    delete taskDiv.task;
    dom.getDiv().removeChild(taskDiv);
    storage.storeTasks(dom.getDiv());
}

function stopTasks() {
    for (const taskDiv of dom.getDiv().getElementsByClassName('task')) {
        stopTask(taskDiv);
    }
}

function stopTask(taskDiv) {
    taskDiv.getElementsByClassName('timer')[0].textContent = 'Start';
    taskDiv.getElementsByClassName('timer')[0].classList.remove('stop');
    taskDiv.getElementsByClassName('timer')[0].classList.add('start');
    taskDiv.task.stop();
}

// task === null signifies call from new task event
// instead of from restore function.
function startNewTask(_, task = null) {
    if (task === null) {
        dom.enableRunMode(restoreTasks);
        stopTasks();
    }

    const parms = {
        task,
        toggleTimer,
        discardTask,
        stopTask,
    }

    const newTask = dom.createNewTask(parms);

    if (task === null) {
        newTask.task = taskFactory.create();
        newTask.task.start();
        storage.storeTasks(dom.getDiv());
    }
    else {
        newTask.task = task;
        newTask.description.value = newTask.task.getDescription();
    }
}

dom.createStartButton(startNewTask);
dom.createRestoreButton(restoreTasks);
dom.createTotalizer();

setInterval(dom.updateRuntimes, 500);
setInterval(dom.updateTotalizer, 500);
